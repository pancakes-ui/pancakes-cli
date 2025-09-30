import { cyan, dim, green, yellow } from 'colorette';
import fs from 'fs';
import path from 'path';

export function printLogo(statusMessage?: string) {

    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const version = pkg.version || '0.0.0';

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
}
