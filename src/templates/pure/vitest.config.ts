export const vitestConfigPureTemplate = (params?: Object): string => {

  const configObject = {
    test: {
      exclude: [],
    },
    ...params
  };
  return `import { defineConfig } from 'vitest/config';

export default defineConfig(${JSON.stringify(configObject, null, 2)});
`;
};
