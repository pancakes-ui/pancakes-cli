import { execSync } from 'child_process';
import prompts from 'prompts';
import semver from 'semver';
import { isUnix } from '../is-unix';
import { printLogo } from '../print-logo';
import { sleep } from '../sleep';
import { getInstalledVersion } from '../get-installed-version';
import { isInstalledGlobally } from '../is-installed-globally';

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

        const globalInstall = isInstalledGlobally();

        const installCmd = globalInstall
            ? (isUnix() ? 'sudo npm install -g pancakes-cli@latest' : 'npm install -g pancakes-cli@latest')
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
