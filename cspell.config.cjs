module.exports = {
  words: [
    'fullfiller',
    'gusalbukrk',
    'stopword',
    'stopwords',
    'freqmap',
    'subpackage',
    'subpackages',
    'fontawesome',
    'fortawesome',
    'pnpm',
    'commitlint',
  ],

  ignoreWords: ['postbuild', 'postpublish', 'monospace'],

  ignorePaths: [
    'node_modules',
    'dist/',
    'cspell.config.cjs', // otherwise, would've to be included in every `overrides.filename`
    '.gitignore',
    '.git/',
    '.husky/_/',
  ],

  overrides: [
    {
      filename: [
        'babel.config.cjs',
        '.eslintrc.cjs',
        'package.json',
        'rollup.config.js',
        'ISSUES.md',
      ], // config files
      words: [
        'npmignore',
        'corejs',
        'includepaths',
        'stylelint',
        'abspath',
        'relpath',
        'loglevel',
      ],
    },
    {
      filename: 'packages/get-wikipedia-article/',
      words: [
        'exintro',
        'explaintext',
        'cllimit',
        'clshow',
        'plcontinue',
        'pllimit',
        'plnamespace',
        'pageterms',
        'wbptlanguage',
        'wbptterms',
        'opensearch',
        'pageprops',
        'ppprop',
      ],
    },
    {
      filename: 'packages/get-wikipedia-article/src/index.spec.ts',
      words: ['xxyyzz'], // this string is used to trigger `articleNotFound` error
    },
    {
      filename: './README.md',
      words: [
        'baconipsum',
        'hipsum',
        'Hermione',
        'Weasley',
        'Grafica',
        'Veneta',
        'pentalogy',
        'wizarding',
        'Snape',
      ],
    },
  ],
};
