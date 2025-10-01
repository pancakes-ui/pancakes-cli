
import prompts from 'prompts';
import { green, blue, red, yellow, bold } from 'colorette';
import { PublishManager } from '../../actions/publish-manager';
import { LibraryCreator } from '../../actions/library-creator';
import { printLogo } from '../print-logo';

export async function mainMenu(statusMessage?: string) {
    console.clear();

    // Always print logo with update check enabled
    printLogo(statusMessage);

    const response = await prompts({
        type: 'select',
        name: 'action',
        message: bold('What would you like to do?'),
        choices: [
            { title: green('🍳 Create a new TypeScript library'), value: 'create' },
            { title: blue('🚀 Publish package'), value: 'publish' },
            // Removed checkUpdate option here
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
