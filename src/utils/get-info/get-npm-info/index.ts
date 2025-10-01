import { execSync } from "child_process";

export function getNpmUsername(): string | null {
    try {
        const username = execSync('npm whoami', { encoding: 'utf-8' }).trim();
        return username || null;
    } catch {
        return null;
    }
}
