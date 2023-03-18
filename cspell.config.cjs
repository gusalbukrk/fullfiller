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
    'commitlint',
    'stylelint',
    'unflatten',
    'corejs',
    'loglevel',
    'postbuild',
    'postpublish',
  ],

  ignorePaths: [
    'node_modules',
    'dist/',
    'cspell.config.cjs', // otherwise, would've to be included in every `overrides.filename`
    '.git/',
  ],

  overrides: [
    {
      filename: 'packages/get-wikipedia-article/',
      words: [
        // specific terms used in Wikipedia's API
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
