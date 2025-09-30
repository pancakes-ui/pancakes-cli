import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import prompts from 'prompts';
import semver from 'semver';
import { createSpinner } from 'nanospinner';

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
                if (!semver.valid(input)) {
                    return 'Please enter a valid semver version.';
                }
                if (semver.lte(input, currentVersion)) {
                    return `Version must be greater than the current version (${currentVersion}).`;
                }
                return true;
            },
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
            message: 'Do you want to run `npm run rollup` build now before publishing?',
            initial: true,
        });

        if (runBuildNow) {
            const buildSpinner = createSpinner('Running build (`npm run rollup`)...').start();
            try {
                execSync('npm run rollup', { cwd: projectPath, stdio: 'inherit' });
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

        // Publish with --access public
        const publishSpinner = createSpinner('Publishing package to npm...').start();
        try {
            execSync('npm publish --access public', { cwd: projectPath, stdio: 'inherit' });
            publishSpinner.success({ text: 'Package published to npm successfully!' });
        } catch (error) {
            publishSpinner.error({ text: 'Failed to publish package to npm.' });
            console.error(error);
        }
    }

    findPancakesPackages(rootDir: string) {
        const dirs = fs.readdirSync(rootDir, { withFileTypes: true });
        const packages: { name: string; version: string; path: string }[] = [];

        for (const dirent of dirs) {
            if (dirent.isDirectory()) {
                const pkgPath = path.join(rootDir, dirent.name);
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
        const spinner = createSpinner();

        if (!fs.existsSync(nodeModulesPath)) {
            spinner.start('Installing dependencies...');
            try {
                execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
                spinner.success({ text: 'Dependencies installed.' });
            } catch (error) {
                spinner.error({ text: 'Failed to install dependencies.' });
                throw error;
            }
        } else {
            // Check if rollup binary exists (simple check)
            const rollupPath = path.join(projectPath, 'node_modules', '.bin', 'rollup');
            if (!fs.existsSync(rollupPath)) {
                spinner.start('Installing missing dependencies...');
                try {
                    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
                    spinner.success({ text: 'Dependencies installed.' });
                } catch (error) {
                    spinner.error({ text: 'Failed to install dependencies.' });
                    throw error;
                }
            }
        }
    }
}
