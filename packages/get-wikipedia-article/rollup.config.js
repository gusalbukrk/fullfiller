import del from 'rollup-plugin-delete';

import config from '../../rollup.config.js'; // eslint-disable-line

// edit what should be deleted after building types
config[1].plugins[1] = del({
  targets: [
    'dist/types',

    // building this (sub)package is triggering the generation of declaration
    // file(s) in `xlorem-common` (most specifically, `errorMessages.d.ts`)
    '../common/src/*.d.ts',
  ],

  force: true, // needed to delete files outside current working directory

  hook: 'buildEnd',
  runOnce: true,
});

export default config;
