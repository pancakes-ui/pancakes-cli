import { execSync } from 'child_process';
import { blue, bold, red } from 'colorette';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { gitignoreTemplate } from '../../templates/gitignore';
import { indexTestPureTemplate } from '../../templates/pure/index-test.template';
import { indexPureTemplate } from '../../templates/pure/index.template';
import { jestConfigPureTemplate } from '../../templates/pure/jest.config';
import { packageJsonPureTemplate } from '../../templates/pure/package.json';
import { tsConfigPureTemplate } from '../../templates/pure/tsconfig.json';
import { tsupConfigPureTemplate } from '../../templates/pure/tsup.config';
import { vitestConfigPureTemplate } from '../../templates/pure/vitest.config';
import { execution } from '../../utils/execution';
import { getNpmUsername } from '../../utils/get-info/get-npm-info';

export class LibraryCreator {
    test = ""
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
        console.log("68", projectPath);
        await this.createTestConfig(projectPath);
        this.initPackageJson(projectPath, responses.name, responses.author);
        this.createTsConfig(projectPath);
        this.createTsupConfig(projectPath);
        this.createGitignore(projectPath);
        this.createSrcIndex(projectPath);

        console.log(`✅ Project '${responses.name}' created successfully at ${projectPath}`);
    }

    createFolder(name: string) {
        return execution({
            startMessage: `Creating folder '${name}'...`,
            errorMessage: `Failed to create folder '${name}'`,
            successMessage: `Folder '${name}' created`,
            callback: () => {
                const folderPath = path.resolve(process.cwd(), name);
                if (fs.existsSync(folderPath)) {
                    return { isError: true, data: `Folder '${name}' already exists.` };
                }
                fs.mkdirSync(folderPath, { recursive: true });
                return { data: folderPath }
            }
        });
    }

    initPackageJson(projectPath: string, name: string, author: string) {
        execution({
            startMessage: 'Initializing package.json...', successMessage: 'package.json initialized', errorMessage: 'Failed to initialize package.json', callback: () => {
                const packageJson = packageJsonPureTemplate({ name, author, test: this.test as ("jest" | "vitest") })
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
    async createTestConfig(projectPath: string) {
        const response = await prompts({
            type: 'select',
            name: 'action',
            message: bold('Which testing package you want to use?'),
            choices: [
                { title: blue('Jest'), value: 'jest' },
                { title: red('Vitest'), value: 'vitest' },
            ],
            initial: 0,
        });
        this.test = response.action
        execution({
            callback: () => {
                let config = "";
                switch (response.action) {
                    case 'jest':
                        config = jestConfigPureTemplate();
                        break;
                    case 'vitest':
                        config = vitestConfigPureTemplate()
                        break;
                }

                fs.writeFileSync(
                    path.join(projectPath, `${response.action}.config.ts`),
                    config
                );
            }, errorMessage: `Failed to create ${response.action}.config.ts.config.ts`
            , successMessage: `${response.action}.config.ts created`, startMessage: `Creating ${response.action}.config.ts...`
        })
    }
    createTsupConfig(projectPath: string) {
        execution({
            startMessage: 'Creating tsup.config.ts...', successMessage: 'tsup.config.ts created', errorMessage: 'Failed to create rollup.config.js', callback: () => {
                const content = tsupConfigPureTemplate();
                fs.writeFileSync(path.join(projectPath, 'tsup.config.ts'), content);
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
                const contentTest = indexTestPureTemplate();
                fs.writeFileSync(path.join(srcPath, 'index.ts'), content);
                fs.writeFileSync(path.join(srcPath, 'index.test.ts'), contentTest);
            }
        })
    }
}
