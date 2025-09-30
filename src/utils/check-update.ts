import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import semver from 'semver';
import prompts from 'prompts';
import { printLogo } from './print-logo';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get currently installed pancakes-cli version.
 * Checks local, then global, then package.json fallback.
 */
function getInstalledVersion(): string {
    try {
        const localOutput = execSync('npm ls pancakes-cli --json', { encoding: 'utf-8' });
        const localData = JSON.parse(localOutput);
        const localVersion = localData.dependencies?.['pancakes-cli']?.version;
        if (localVersion) {
            return localVersion;
        }
    } catch {
        // ignore errors
    }

    try {
        const globalOutput = execSync('npm ls -g pancakes-cli --json', { encoding: 'utf-8' });
        const globalData = JSON.parse(globalOutput);
        const globalVersion = globalData.dependencies?.['pancakes-cli']?.version;
        if (globalVersion) {
            return globalVersion;
        }
    } catch {
        // ignore errors
    }

    try {
        const pkgPath = path.resolve(__dirname, '../package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkgJson.version) {
            return pkgJson.version;
        }
    } catch {
        // ignore errors
    }

    return '0.0.0';
}

/**
 * Detect if pancakes-cli is installed globally.
 */
function isInstalledGlobally(): boolean {
    try {
        const local = execSync('npm ls pancakes-cli --json', { encoding: 'utf-8' });
        const localData = JSON.parse(local);
        if (localData.dependencies && localData.dependencies['pancakes-cli']) {
            // Found locally installed
            return false;
        }
    } catch { }

    try {
        const global = execSync('npm ls -g pancakes-cli --json', { encoding: 'utf-8' });
        const globalData = JSON.parse(global);
        if (globalData.dependencies && globalData.dependencies['pancakes-cli']) {
            // Found globally installed
            return true;
        }
    } catch { }

    // Default to global false if unknown
    return false;
}

/**
 * Checks for update and prompts user to update.
 * Runs npm install with sudo if global on macOS/Linux.
 * Returns true if update was performed, false if no update or user declined.
 */
export async function checkForUpdate(): Promise<boolean> {
    console.clear();

    printLogo(undefined);

    const localVersion = getInstalledVersion();

    let npmVersion = '0.0.0';
    try {
        npmVersion = execSync('npm view pancakes-cli version', { encoding: 'utf-8' }).trim() || npmVersion;
    } catch {
        // ignore errors
    }

    if (semver.valid(localVersion) && semver.valid(npmVersion) && semver.lt(localVersion, npmVersion)) {
        const response = await prompts({
            type: 'confirm',
            name: 'continue',
            message: `⚠️  A newer version of pancakes-cli is available (v${npmVersion}). Do you want to update now?`,
            initial: true,
        });

        if (!response.continue) {
            console.log('Exiting...');
            process.exit(0);
        }

        process.stdout.write('Updating to the latest version... Please wait.\n');

        const isUnix = process.platform !== 'win32';
        const globalInstall = isInstalledGlobally();

        const installCmd = globalInstall
            ? (isUnix ? 'sudo npm install -g pancakes-cli@latest' : 'npm install -g pancakes-cli@latest')
            : 'npm install pancakes-cli@latest';

        try {
            execSync(installCmd, { stdio: 'inherit' });
            console.clear();
        } catch (err) {
            console.error('Update failed:', err);
            process.exit(1);
        }

        await sleep(1000);

        return true;
    }

    return false;
}
