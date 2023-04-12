module.exports = {
  root: true,

  ignorePatterns: ['dist/'],

  plugins: ['prettier', 'jest', 'promise', 'jest-formatting'],

  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    babelOptions: { configFile: './babel.config.cjs' },
  },

  extends: [
    'airbnb-base',
    'prettier',
    'plugin:jest/all',
    'plugin:json/recommended',
    'plugin:promise/recommended',
    'plugin:node/recommended',
    'plugin:jest-formatting/recommended',
  ],

  rules: {
    'prettier/prettier': 'error',

    'json/*': ['error', 'allowComments'],

    'max-len': [
      'warn',
      {
        code: 80, // must be the same as prettierrc's printWidth
        comments: 100,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],

    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        groups: [
          'builtin',
          'external',
          'internal',
          'unknown',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
      },
    ],

    'jest/require-hook': 'off',

    // add on eslint-plugin-jest 26.6.0
    'jest/max-expects': [
      'warn',
      {
        max: 10,
      },
    ],

    // can only be enable when parser is set to @typescript-eslint/parser
    // which only is the case for .ts and .tsx files (check overrides below)
    'jest/unbound-method': 'off',
  },

  settings: {
    // fix 'import/no-unresolved' error
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },

    // plugin-wide config for eslint-plugin-node
    node: {
      tryExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/recommended',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: './tsconfig.json' },
      plugins: ['@typescript-eslint'],
      rules: {
        // disable some base rules and enable their typescript-eslint; otherwise, incorrect errors
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-am-using-a-rule-from-eslint-core-and-it-doesnt-work-correctly-with-typescript-code
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],

        // fix 'import/extensions' error
        'import/extensions': ['error', 'never', { json: 'always' }],

        // otherwise, will get `import/no-extraneous-dependencies` error
        // if devDependency is imported in a test file
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/__tests__/**',
              '**/*{.,_}{test,spec}.{ts,tsx}',
            ],
          },
        ],

        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

        'jest/unbound-method': 'error',
      },
    },
    {
      files: ['./*.{js,cjs}'], // root config files
      rules: {
        // goal of this rule is to prevent MODULE_NOT_FOUND errors after `npm publish`
        // production files can import only other production files & dependencies/peerDependencies
        // production files = all in `files` field at `package.json`; anything not in `.npmignore`
        // you can only import `devDependencies` in files that won't be published
        // NOTE: `eslint-plugin-node` don't expand braces, which can result in false positive errors
        // https://github.com/mysticatea/eslint-plugin-node/issues/199
        // if this happen, edit `package.json`'s `files` field to not use braces in globs
        'node/no-unpublished-import': ['off'],
      },
    },
    {
      files: ['dist/index.d.ts'],
      rules: {
        'no-restricted-exports': 'off',
      },
    },
    {
      files: ['**/__tests__/**', '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}'],
      rules: {
        // usually there's no need to use `overrides` to ensure that
        // jest-only rules are applied only to test files, however
        // `require-hook` rule is aggressive and can result in false positives in non-test files
        // https://github.com/jest-community/eslint-plugin-jest/issues/934#issuecomment-944026446
        'jest/require-hook': 'error',

        'jest/no-conditional-in-test': 'off',
      },
    },
    {
      files: ['jest.config.js'],
      rules: {
        'import/no-relative-packages': 'off',
      },
    },
  ],
};
