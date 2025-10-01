import { execSync } from 'child_process';
import fs from 'fs';
import { createSpinner } from 'nanospinner';
import path from 'path';
import prompts from 'prompts';
import semver from 'semver';
import { execution } from '../utils/execution';

export class PublishManager {
    async run() {
        console.log('📦 Publish a package to npm');

        // Find all package directories in current dir with pancakes-cli marker
        const packages = this.findPancakesPackages(process.cwd());

        if (packages.length === 0) {
            console.error('❌ No pancakes-cli packages found in the current directory.');
            return;
        }

        // Prompt user to select a package
        const { selectedPackage } = await prompts({
            type: 'select',
            name: 'selectedPackage',
            message: 'Select a package to publish:',
            choices: packages.map((pkg) => ({
                title: `${pkg.name} (v${pkg.version})`,
                value: `${pkg.name} (v${pkg.version})`,
            })),
        });

        if (!selectedPackage) {
            console.log('✋ Publish cancelled.');
            return;
        }

        // Get full path of selected package
        const packageInfo = packages.find(
            (p) => `${p.name} (v${p.version})` === selectedPackage
        )!;

        const projectPath = packageInfo.path;
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        const currentVersion = packageJson.version || '0.0.0';
        console.log(`Current version of ${packageJson.name} is: ${currentVersion}`);

        // Prompt new version
        const { newVersion } = await prompts({
            type: 'text',
            name: 'newVersion',
            message: 'Enter the version you want to publish:',
            initial: currentVersion,
            validate: (input: string) => {
                const stripped = input.startsWith('v') ? input.slice(1) : input;
                if (!semver.valid(stripped)) {
                    return 'Please enter a valid semver version (e.g., v1.2.3 or 1.2.3).';
                }
                if (semver.lte(stripped, currentVersion)) {
                    return `Version must be greater than the current version (${currentVersion}).`;
                }
                return true;
            }
        });

        if (!newVersion) {
            console.log('✋ Publish cancelled.');
            return;
        }

        // Update package.json with new version
        packageJson.version = newVersion;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

        // Ensure dependencies installed (npm install if needed)
        await this.ensureDependenciesInstalled(projectPath);

        // Confirm user ran the build or want to run it now
        const { runBuildNow } = await prompts({
            type: 'confirm',
            name: 'runBuildNow',
            message: 'Do you want to run `npm run build` build now before publishing?',
            initial: true,
        });

        if (runBuildNow) {
            const buildSpinner = createSpinner('Running build (`npm run build`)...').start();
            try {
                execSync('npm run build', { cwd: projectPath, stdio: 'inherit' });
                buildSpinner.success({ text: 'Build completed successfully.' });
            } catch (error) {
                buildSpinner.error({ text: 'Build failed. Please fix errors before publishing.' });
                return;
            }
        } else {
            console.log(
                '⚠️ Skipping build step. Make sure the package is properly built before publishing.'
            );
        }

        // Confirm publishing
        const { confirmPublish } = await prompts({
            type: 'confirm',
            name: 'confirmPublish',
            message: `Are you sure you want to publish '${packageJson.name}@${newVersion}' to npm?`,
            initial: false,
        });

        if (!confirmPublish) {
            console.log('Publish cancelled.');
            return;
        }

        execution({
            startMessage: 'Publishing package to npm...', errorMessage: 'Failed to publish package to npm.', successMessage: 'Package published to npm successfully!', callback: () => {
                execSync('npm publish --access public', { cwd: projectPath, stdio: 'inherit' });
            }
        })

    }

    findPancakesPackages(rootDir: string) {
        const packages: { name: string; version: string; path: string }[] = [];

        // Check current directory package.json
        const currentPkgJsonPath = path.join(rootDir, 'package.json');
        if (fs.existsSync(currentPkgJsonPath)) {
            try {
                const currentPkgJson = JSON.parse(fs.readFileSync(currentPkgJsonPath, 'utf-8'));
                if (currentPkgJson['pancakes-cli']) {
                    packages.push({
                        name: currentPkgJson.name || path.basename(rootDir),
                        version: currentPkgJson.version || '0.0.0',
                        path: rootDir,
                    });
                }
            } catch {
                // Ignore JSON errors
            }
        }

        // Check immediate subdirectories
        const dirs = fs.readdirSync(rootDir, { withFileTypes: true });
        for (const dirent of dirs) {
            if (dirent.isDirectory()) {
                const pkgPath = path.join(rootDir, dirent.name);
                // Skip if already checked current dir
                if (pkgPath === rootDir) continue;

                const pkgJsonPath = path.join(pkgPath, 'package.json');
                if (fs.existsSync(pkgJsonPath)) {
                    try {
                        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
                        if (pkgJson['pancakes-cli']) {
                            packages.push({
                                name: pkgJson.name || dirent.name,
                                version: pkgJson.version || '0.0.0',
                                path: pkgPath,
                            });
                        }
                    } catch {
                        // Ignore parse errors
                    }
                }
            }
        }

        return packages;
    }


    async ensureDependenciesInstalled(projectPath: string) {
        const nodeModulesPath = path.join(projectPath, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            return execution({
                startMessage: 'Installing dependencies...', successMessage: 'Dependencies installed.', errorMessage: 'Failed to install dependencies.', callback: () => {
                    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
                }
            })
        }
        const jestPath = path.join(projectPath, 'node_modules', '.bin', 'jest');
        if (!fs.existsSync(jestPath)) {
            execution({
                startMessage: 'Installing missing dependencies...', successMessage: 'Dependencies installed.', errorMessage: 'Failed to install dependencies.', callback: () => {
                    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
                }
            })
        }
    }
}
