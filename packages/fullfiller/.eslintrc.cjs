const path = require('path');

const config = require('../../.eslintrc.cjs');

config.overrides[0].parserOptions.project = './tsconfig.json';

// when importing a dependency that isn't in subpackage's `package.json`
// will get 2 errors: `node/no-extraneous-import` & `import/no-extraneous-dependencies`
config.overrides.push({
  files: ['**/__tests__/**', '**/*{.,_}{test,spec}.{ts,tsx}'],
  rules: {
    'node/no-extraneous-import': [
      'error',
      {
        allowModules: ['cross-fetch'],
      },
    ],

    'import/no-extraneous-dependencies': [
      'error',
      { packageDir: [__dirname, path.join(__dirname, '..', '..')] },
    ],
  },
});

module.exports = config;
