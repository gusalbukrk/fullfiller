// eslint-disable-next-line import/no-unresolved, import/extensions, node/no-missing-import
import config from '@fullfiller/monorepo/rollup.config.js';

// only needed because currently package doesn't import any dependency
config[1].input = 'dist/types/index.d.ts';

export default config;
