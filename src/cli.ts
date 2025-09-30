import minimist from 'minimist';
import prompts from 'prompts';
import { green, blue, red, yellow, bold } from 'colorette';
import { LibraryCreator } from './actions/library-creator';
import { PublishManager } from './actions/publish-manager';
import { printLogo } from './utils/print-logo';

async function mainMenu(statusMessage?: string) {
    console.clear();

    printLogo(statusMessage);

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: bold('What would you like to do?'),
        choices: [
            { title: green('🍳 Create a new TypeScript library'), value: 'create' },
            { title: blue('🚀 Publish package'), value: 'publish' },
            { title: red('❌ Exit'), value: 'exit' },
        ],
        initial: 0,
    });

    switch (response.action) {
        case 'create':
            await new LibraryCreator().run();
            await mainMenu('Library created successfully!');
            break;
        case 'publish':
            await new PublishManager().run();
            await mainMenu('Publish process completed!');
            break;
        case 'exit':
        default:
            console.log(yellow('👋 Goodbye!'));
            process.exit(0);
    }
}

async function main() {
    const args = minimist(process.argv.slice(2));

    if (args.help || args.h) {
        console.log('Usage: pancakes-cli');
        process.exit(0);
    }

    // Start interactive menu
    await mainMenu();
}

main().catch(err => {
    console.error(red('Error:'), err);
    process.exit(1);
});
