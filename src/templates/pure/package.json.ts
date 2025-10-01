export const packageJsonPureTemplate = ({ name, author }: { name: string, author: string }) => {
    return {
        name,
        version: '0.0.0',
        description: '',
        main: 'dist/index.js',
        scripts: {
            "start": "node --import=tsx src/index.ts",
            "build": "tsup src/index.ts --format cjs --dts --clean --minify",
            "test": "jest",
        },
        author,
        license: 'MIT',
        "pancakes-cli": true, // marker
        devDependencies: {
            typescript: '^5.1.3',
            rollup: '^3.29.4',
            "tsup": "^8.5.0",
            "tsx": "^4.20.6",
            "@types/jest": "^30.0.0",
            "jest": "^30.2.0",
            "ts-jest": "^29.4.4",
            '@rollup/plugin-node-resolve': '^15.1.0',
            '@rollup/plugin-commonjs': '^24.0.1',
            '@rollup/plugin-typescript': '^11.0.0',
        },
    };
}