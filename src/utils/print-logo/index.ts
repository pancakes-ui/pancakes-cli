import { cyan, dim, green, yellow } from 'colorette';
import { execSync } from 'child_process';

export function printLogo(statusMessage?: string) {
    let version = '0.0.0';

    try {
        const npmOutput = execSync('npm view pancakes-cli version', { encoding: 'utf-8' }).trim();
        version = npmOutput || version;
    } catch (error) {
        console.warn('Warning: Could not get version from npm');
    }

    const logo = [
        yellow('  |-----🧈------|'),
        yellow('  |---PANCAKE---|'),
        yellow('  |---STACKED---|'),
        yellow('  |---GOODNESS--|'),
        yellow('  |-------------|'),
        '',
        cyan('🥞 pancakes-cli ') + dim(`v${version}`),
        cyan('  Your TypeScript library toolkit'),
        cyan('  Build. Publish. Repeat.'),
    ];

    console.log(); // top spacing
    logo.forEach(line => console.log(line));

    if (statusMessage) {
        console.log('\n' + green(`✔ ${statusMessage}`) + '\n');
    } else {
        console.log('\n');
    }
    return version !== "0.0.0";
}
