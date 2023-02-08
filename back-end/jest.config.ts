import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json'; // replace with the path to your tsconfig.json file
import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
};

export default jestConfig;
