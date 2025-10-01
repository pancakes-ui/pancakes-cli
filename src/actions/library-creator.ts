import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { gitignoreTemplate } from '../templates/gitignore';
import { indexPureTemplate } from '../templates/pure/index.template';
import { packageJsonPureTemplate } from '../templates/pure/package.json';
import { rollupConfigPureTemplate } from '../templates/pure/rollup.config';
import { tsConfigPureTemplate } from '../templates/pure/tsconfig.json';
import { execution } from '../utils/execution';
import { getNpmUsername } from '../utils/get-info/get-npm-info';


export class LibraryCreator {
    async run() {
        console.log('🛠️ Creating a new TypeScript library...');

        const defaultAuthor = getNpmUsername();

        const responses = await prompts([
            {
                type: 'text',
                name: 'name',
                message: 'Project name:',
                initial: 'your-lib-name',
                validate: async (input: string) => {
                    if (!input || input.trim().length === 0) {
                        return 'Project name cannot be empty.';
                    }
                    if (input !== input.toLowerCase()) {
                        return 'Project name must be lowercase.';
                    }
                    if (!/^[a-z0-9\-]+$/.test(input)) {
                        return 'Project name can only contain lowercase letters, numbers, and hyphens.';
                    }
                    try {
                        execSync(`npm view ${input} version`, { stdio: 'ignore' });
                        return `Package name "${input}" is already taken on npm. Please choose another name.`;
                    } catch {
                        return true; // name available
                    }
                },
            },
            {
                type: 'text',
                name: 'author',
                message: 'Author (npm username):',
                initial: defaultAuthor ?? undefined,
                validate: (input: string) => {
                    if (!input || input.trim().length === 0) {
                        return 'Author username is required.';
                    }
                    return true;
                },
            },
        ]);

        if (!responses.name || !responses.author) {
            console.log('✋ Aborted');
            process.exit(1);
        }

        const projectPath = this.createFolder(responses.name);

        this.initPackageJson(projectPath, responses.name, responses.author);
        this.createTsConfig(projectPath);
        this.createRollupConfig(projectPath);
        this.createGitignore(projectPath);
        this.createSrcIndex(projectPath);

        console.log(`✅ Project '${responses.name}' created successfully at ${projectPath}`);
    }

    createFolder(name: string) {
        return execution({
            startMessage: `Creating folder '${name}'...`, errorMessage: `Failed to create folder '${name}'`, successMessage: `Folder '${name}' created`, callback: () => {
                const folderPath = path.resolve(process.cwd(), name);
                if (fs.existsSync(folderPath)) {
                    return { isError: true, data: `Folder '${name}' already exists.` }
                }
                fs.mkdirSync(folderPath, { recursive: true });
                return folderPath
            }
        })
    }

    initPackageJson(projectPath: string, name: string, author: string) {
        execution({
            startMessage: 'Initializing package.json...', successMessage: 'package.json initialized', errorMessage: 'Failed to initialize package.json', callback: () => {
                const packageJson = packageJsonPureTemplate({ name, author })
                fs.writeFileSync(
                    path.join(projectPath, 'package.json'),
                    JSON.stringify(packageJson, null, 2)
                );
            }
        })

    }

    createTsConfig(projectPath: string) {
        execution({
            callback: () => {
                const tsconfig = tsConfigPureTemplate()

                fs.writeFileSync(
                    path.join(projectPath, 'tsconfig.json'),
                    JSON.stringify(tsconfig, null, 2)
                );
            }, errorMessage: 'Failed to create tsconfig.json'
            , successMessage: 'tsconfig.json created', startMessage: 'Creating tsconfig.json...'
        })
    }

    createRollupConfig(projectPath: string) {
        execution({
            startMessage: 'Creating rollup.config.js...', successMessage: 'rollup.config.js created', errorMessage: 'Failed to create rollup.config.js', callback: () => {
                const content = rollupConfigPureTemplate();
                fs.writeFileSync(path.join(projectPath, 'rollup.config.js'), content);
            }
        })
    }

    createGitignore(projectPath: string) {
        execution({
            startMessage: 'Creating .gitignore...', successMessage: '.gitignore created', errorMessage: 'Failed to create .gitignore', callback: () => {
                const content = gitignoreTemplate()
                fs.writeFileSync(path.join(projectPath, '.gitignore'), content);
            }
        })
    }

    createSrcIndex(projectPath: string) {
        execution({
            startMessage: 'Creating src/index.ts...', successMessage: 'src/index.ts created', errorMessage: 'Failed to create src/index.ts', callback: () => {
                const srcPath = path.join(projectPath, 'src');
                if (!fs.existsSync(srcPath)) {
                    fs.mkdirSync(srcPath);
                }
                const content = indexPureTemplate();
                fs.writeFileSync(path.join(srcPath, 'index.ts'), content);
            }
        })
    }
}
