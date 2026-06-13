/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/services', '<rootDir>/utils'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['services/**/*.ts', 'utils/**/*.ts', '!**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};
