type TsConfigTemplate = { compilerOptions?: Object, etc?: Object };
export const tsConfigPureTemplate = ({ compilerOptions, etc }: TsConfigTemplate = {}) => {

    return {
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
            ...compilerOptions
        },
        include: ['src'],
        ...etc
    };
}