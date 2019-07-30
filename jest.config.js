module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/ts-jest',
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  setupFiles: ['<rootDir>/src/setupTests.ts'],
};
