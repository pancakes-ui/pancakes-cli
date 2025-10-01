import { red } from 'colorette';
import minimist from 'minimist';
import { mainMenu } from './utils/main-menu';
import { printLogo } from './utils/print-logo';
import { checkForUpdate } from './utils/check-update';


export async function main() {
    const args = minimist(process.argv.slice(2));

    if (args.help || args.h) {
        console.log('Usage: pancakes-cli\nSee documentation at https://github.com/pancakes-ui/pancakes-cli/blob/main/README.md');
        process.exit(0);
    }


    if (args['check-update']) {
        printLogo(undefined);
        process.exit(0);
    }

    await checkForUpdate();

    // Continue with menu after update check
    await mainMenu();
}


main().catch(err => {
    console.error(red('Error:'), err);
    process.exit(1);
});
