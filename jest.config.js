export default {
  testEnvironment: 'node',
  coverageProvider: 'v8',
  projects: [
    {
      displayName: 'jest',
      transform: {
        '^.+\\.jsx?$': 'babel-jest', // to also be able to write tests in javascript
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: './tsconfig.json',
          },
        ],
      },
    },
    {
      displayName: 'eslint',
      runner: 'jest-runner-eslint',
    },
  ],
  watchPlugins: ['jest-runner-eslint/watch-fix'],
};
