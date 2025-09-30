import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import { createSpinner } from 'nanospinner';

function getNpmUsername(): string | null {
    try {
        const username = execSync('npm whoami', { encoding: 'utf-8' }).trim();
        return username || null;
    } catch {
        return null;
    }
}

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
        const spinner = createSpinner(`Creating folder '${name}'...`).start();
        try {
            const folderPath = path.resolve(process.cwd(), name);
            if (fs.existsSync(folderPath)) {
                spinner.error({ text: `Folder '${name}' already exists.` });
                throw new Error(`Folder '${name}' already exists.`);
            }
            fs.mkdirSync(folderPath, { recursive: true });
            spinner.success({ text: `Folder '${name}' created` });
            return folderPath;
        } catch (error) {
            spinner.error({ text: `Failed to create folder '${name}'` });
            throw error;
        }
    }

    initPackageJson(projectPath: string, name: string, author: string) {
        const spinner = createSpinner('Initializing package.json...').start();
        try {
            const packageJson = {
                name,
                version: '0.0.0',
                description: '',
                main: 'dist/index.js',
                scripts: {
                    build: 'rollup -c',
                    prepare: 'npm run build',
                    rollup: "rollup -c --bundleConfigAsCjs",
                    test: 'echo "No tests yet"',
                },
                author,
                license: 'MIT',
                "pancakes-cli": true, // marker
                devDependencies: {
                    typescript: '^5.1.3',
                    rollup: '^3.29.4',
                    '@rollup/plugin-node-resolve': '^15.1.0',
                    '@rollup/plugin-commonjs': '^24.0.1',
                    "tslib": "^2.8.1",
                    '@rollup/plugin-typescript': '^11.0.0',
                },
            };

            fs.writeFileSync(
                path.join(projectPath, 'package.json'),
                JSON.stringify(packageJson, null, 2)
            );

            spinner.success({ text: 'package.json initialized' });
        } catch (error) {
            spinner.error({ text: 'Failed to initialize package.json' });
            throw error;
        }
    }

    createTsConfig(projectPath: string) {
        const spinner = createSpinner('Creating tsconfig.json...').start();
        try {
            const tsconfig = {
                compilerOptions: {
                    target: 'ES2017',
                    module: 'ESNext',
                    declaration: true,
                    outDir: 'dist',
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    moduleResolution: 'Node',
                    forceConsistentCasingInFileNames: true,
                },
                include: ['src'],
            };

            fs.writeFileSync(
                path.join(projectPath, 'tsconfig.json'),
                JSON.stringify(tsconfig, null, 2)
            );

            spinner.success({ text: 'tsconfig.json created' });
        } catch (error) {
            spinner.error({ text: 'Failed to create tsconfig.json' });
            throw error;
        }
    }

    createRollupConfig(projectPath: string) {
        const spinner = createSpinner('Creating rollup.config.js...').start();
        try {
            const content = `import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
};
`;
            fs.writeFileSync(path.join(projectPath, 'rollup.config.js'), content);
            spinner.success({ text: 'rollup.config.js created' });
        } catch (error) {
            spinner.error({ text: 'Failed to create rollup.config.js' });
            throw error;
        }
    }

    createGitignore(projectPath: string) {
        const spinner = createSpinner('Creating .gitignore...').start();
        try {
            const content = `node_modules
dist
`;
            fs.writeFileSync(path.join(projectPath, '.gitignore'), content);
            spinner.success({ text: '.gitignore created' });
        } catch (error) {
            spinner.error({ text: 'Failed to create .gitignore' });
            throw error;
        }
    }

    createSrcIndex(projectPath: string) {
        const spinner = createSpinner('Creating src/index.ts...').start();
        try {
            const srcPath = path.join(projectPath, 'src');
            if (!fs.existsSync(srcPath)) {
                fs.mkdirSync(srcPath);
            }
            const content = `export function hello() {
  return 'Hello from your library!';
}
`;
            fs.writeFileSync(path.join(srcPath, 'index.ts'), content);
            spinner.success({ text: 'src/index.ts created' });
        } catch (error) {
            spinner.error({ text: 'Failed to create src/index.ts' });
            throw error;
        }
    }
}
