type TsConfigTemplate = { compilerOptions?: Object, etc?: Object };
export const tsConfigPureTemplate = ({ compilerOptions, etc }: TsConfigTemplate = {}) => {

    return {
        "compilerOptions": {
            "target": "esnext",
            "module": "esnext",
            "moduleResolution": "node",
            "outDir": "./dist",
            "allowJs": true,
            "rootDir": "./src",
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "skipLibCheck": true,
            "importHelpers": true,
            ...compilerOptions
        },
        "include": ["src"],
        ...etc
    }

}