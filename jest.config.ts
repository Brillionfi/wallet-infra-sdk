import type { Config } from 'jest';

const config: Config = {
  globals: {
    extensionsToTreatAsEsm: ['.ts', '.js'],
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-to-be-transformed)/)',
  ],

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 93,
      functions: 94,
      lines: 94,
      statements: 94,
    },
  },
  coveragePathIgnorePatterns: [
    'src/utils/stampers/bundleStamper/utils.js',
    'src/utils/stampers/bundleStamper/hpke/*',
  ],
  moduleNameMapper: {
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;
