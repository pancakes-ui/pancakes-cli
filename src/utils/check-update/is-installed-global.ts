import { execSync } from "child_process";

export function isInstalledGlobally(): boolean {
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