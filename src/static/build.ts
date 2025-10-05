export type BuildCodes = {
  tsup: string;
  vite: string;
  rollup: string;
  esbuild: string;
};
export type BuildCommands = {
  tsup: (p: string) => string;
  vite: (p: string) => string;
  rollup: (p: string) => string;
  esbuild: (p: string) => string;
};

export const buildCodes: BuildCodes = {
  tsup: `
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  format: ['esm'],
  sourcemap: true,
  clean: true,
});
`,
  vite: `
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
`,
  rollup: `
import { rollup } from 'rollup';
import { mkdir } from 'fs';
import { writeFile } from 'fs/promises';
import { writeFile } from 'fs/promises';

export default {
  input: 'src/app.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
};
`,
  esbuild: `
// esbuild build script
require('esbuild').build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: true,
}).catch(() => process.exit(1));
`,
};

export const buildCommands: BuildCommands = {
  esbuild: (mainfile: string) => `esbuild ${mainfile} --bundle --outdir=dist`,
  tsup: (mainfile: string) =>
    `tsup ${mainfile} --format cjs --dts --clean --minify`,
  rollup: (mainfile: string) =>
    `rollup ${mainfile} --format cjs --file dist/${mainfile}`,
  vite: () => "vite build",
};
