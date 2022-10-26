import path from 'path';
import { fileURLToPath } from 'url';

import { DEFAULT_EXTENSIONS } from '@babel/core';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    input: 'src/index.ts',
    plugins: [
      del({
        targets: 'dist',
        runOnce: true,
      }),
      nodeResolve(),
      commonjs(),
      eslint({
        fix: true,
        throwOnError: true,

        // after update @rollup/plugin-commonjs to v22
        // every time `build` script is run
        // a file `src/index.ts?commonjs-entry` is created
        // following line will stop this from happening
        exclude: [
          path.join(__dirname, 'node_modules', '**'),
          'node_modules/**',
          'src/index.ts?commonjs-entry',
        ],
      }),
      json({
        compact: true,
      }),
      typescript({
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
      }),
    ],
    output: [
      {
        file: 'dist/bundle.js',
        format: 'esm',
      },
      {
        file: 'dist/bundle.cjs',
        format: 'cjs',
        exports: 'auto',
      },
      {
        name: 'fullfiller',
        file: 'dist/umd.js',
        format: 'umd',
        plugins: [terser()],
      },
    ],
  },
  {
    input: `dist/types/${path.basename(
      path.resolve(process.cwd())
    )}/src/index.d.ts`,
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      dts(),
      del({
        targets: 'dist/types',
        hook: 'buildEnd',
        runOnce: true,
      }),
    ],
  },
];
