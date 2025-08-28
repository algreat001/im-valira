"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    rootDir: 'src',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map