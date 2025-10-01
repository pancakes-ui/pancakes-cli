export const packageJsonPureTemplate = ({ name, author }: { name: string, author: string }) => {
    return {
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
}