import path from 'path';
import { fileURLToPath } from 'url';

import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // eslint-disable-line no-underscore-dangle

export default {
  entry: {
    main: './src/index.tsx',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],

    // otherwise, error `Package path ./src is not exported from package`; you could add './src'
    // to `exports` in `fullfiller/package.json`; but then every local package imported would error:
    // `Resolving to directories is not possible with the exports field (request was ./src/)`
    //
    // ALTERNATIVE would be to add `"./src": "./src/index.ts"` in `exports` of every package;
    // add alias to webpack is preferred because changes only happen in `packages/site`
    //
    // futhermore, when typescript add support for `exports`, I'll probably add `./src` export
    // to every package for clarity's sake, which would make these aliases redundant
    alias: {
      'generate-random-text': path.resolve(
        __dirname,
        '..',
        'generate-random-text'
      ),
      'generate-words-freqmap': path.resolve(
        __dirname,
        '..',
        'generate-words-freqmap'
      ),
      'get-wikipedia-article': path.resolve(
        __dirname,
        '..',
        'get-wikipedia-article'
      ),
      'stopwords-utils': path.resolve(__dirname, '..', 'stopwords-utils'),
      'tokenize-words': path.resolve(__dirname, '..', 'tokenize-words'),
      'weighted-randomness': path.resolve(
        __dirname,
        '..',
        'weighted-randomness'
      ),
      fullfiller: path.resolve(__dirname, '..', 'fullfiller'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource', // emits a separate file (replaced file-loader)
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/inline', // inserts inline (replaced url-loader)
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix: true,
    }),
    new StylelintPlugin({
      context: './src',
      fix: true,
    }),
  ],
};
