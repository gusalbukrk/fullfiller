import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

import config from '../../rollup.config.js'; // eslint-disable-line

// no umd bundle
config[0].output = config[0].output.filter((o) => o.format !== 'umd');

// no type declaration files to bundle
config.pop();

// don't generate type declaration files
const typescriptPluginIndex = config[0].plugins.findIndex(
  (p) => p.name === 'rpt2'
);
config[0].plugins[typescriptPluginIndex] = typescript({
  clean: true,

  tsconfigOverride: {
    compilerOptions: {
      declaration: false,
    },
  },
});

// otherwise `Plugin node-resolve: preferring built-in module '...' over local alternative`
const nodeResolvePluginIndex = config[0].plugins.findIndex(
  (p) => p.name === 'node-resolve'
);
config[0].plugins[nodeResolvePluginIndex] = nodeResolve({
  preferBuiltins: true, // already default, but explicity disable warnings
});

export default config;
