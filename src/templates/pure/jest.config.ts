// src/templates/jestConfigPureTemplate.ts
import type { Config } from 'jest';

export const jestConfigPureTemplate = (params?: Config): string => {
  const configObject = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    ...params,
  };

  return `import type { Config } from 'jest';

const config: Config = ${JSON.stringify(configObject, null, 2)};

export default config;
`;
};
