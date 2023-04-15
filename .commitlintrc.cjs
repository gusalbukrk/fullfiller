// https://commitlint.js.org/#/reference-rules
// https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const defaults = require('@commitlint/config-conventional');

module.exports = {
  extends: [
    '@commitlint/config-conventional',

    // enabling config-lerna-scopes is triggering error
    // TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string.
    // https://github.com/lerna/lerna/issues/3579
    // NOTE: when testing if issue has been solved, comment out the scope-enum rule below
    // otherwise plugin won't be used and no error will be thrown anyway
    // '@commitlint/config-lerna-scopes',
  ],

  rules: {
    // rule example
    // 'subject-full-stop': [ 2, 'always', '.' ], // error if subject doesn't ends w/ period

    // temporary solution until config-lerna-scopes issue is solved
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'cli',
        'common',
        'fullfiller',
        'generate-words-freqmap',
        'get-wikipedia-article',
        'site',
        'stopwords-utils',
        'tokenize-words',
        'weighted-randomness',
      ],
    ],

    // if @commitlint/prompt-cli were being used,
    // would additionally need to add any new type to `defaults.prompt.questions.type.enum`
    'type-enum': [
      2,
      'always',
      [...defaults.rules['type-enum'][2], 'config'].sort(),
    ],
  },
};
