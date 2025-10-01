export const tsupConfigPureTemplate = () => {
    return `// tsup.config.ts
export default {
    entry: ['src/cli.ts'],
    format: ['cjs'],
    dts: true,
    clean: true,
    splitting: false, // <- Try false to reduce overhead
    sourcemap: false,
    banner: {
        js: '#!/usr/bin/env node',
    },
};`
}