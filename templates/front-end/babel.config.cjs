// vite projects usually don't use babel,
// in this package babel is only needed because of jest

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 'usage' = add the polyfills needed automatically
        // 'entry' = requires explicit import of core-js
        useBuiltIns: 'usage',
        corejs: {
          version: '3.8', // change it to the last version
          proposals: true,
        },
      },
    ],
    '@babel/preset-react',

    // not needed because babel will only be used by jest to parse tests written in javascript,
    // tests written in typescript will be parsed with ts-jest
    // '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-styled-components',
  ],
};
