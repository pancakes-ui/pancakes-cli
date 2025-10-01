import { execSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";

export function getInstalledVersion(): string {
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
        const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkgJson.version) {
            return pkgJson.version;
        }
    } catch {
        // ignore errors
    }

    return '0.0.0';
}