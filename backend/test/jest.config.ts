import type { Config } from 'jest';

const config: Config = {
  rootDir: '../src',
  testEnvironment: 'node',
  moduleFileExtensions: [ 'ts', 'js', 'json' ],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [ '**/*.(t|j)s' ],
  coverageDirectory: '../coverage',
};

export default config;

