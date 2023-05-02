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
    'vercel',
    'npmignore',
  ],

  ignorePaths: [
    'node_modules',
    'dist/',
    'cspell.config.cjs', // otherwise, would've to be included in every `overrides.filename`
    '.git/',
    './packages/common/src/languages.json',
    './packages/common/src/stopwords.json',
    './packages/stopwords-utils/src/stopwords-frequency.json',
  ],

  overrides: [
    {
      filename: '.gitignore',
      words: [
        'pids',
        'jscoverage',
        'lcov',
        'wscript',
        'jspm',
        'tsbuildinfo',
        'eslintcache',
        'Microbundle',
        'dotenv',
        'nuxt',
        'vuepress',
      ],
    },
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
    {
      filename: './packages/common/src/languages.js',
      words: ['sitematrix', 'localname'],
    },
    {
      filename: './packages/common/README.md',
      words: ['Lucene', 'Stoplist'],
    },
  ],
};
