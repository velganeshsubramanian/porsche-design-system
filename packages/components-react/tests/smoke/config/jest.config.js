module.exports = {
  preset: 'ts-jest',
  rootDir: '../../../',
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/tests/smoke/specs/*.smoke.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  clearMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // override tsconfig.json in package root
        tsconfig: {
          esModuleInterop: false,
        },
      },
    ],
  },
};
