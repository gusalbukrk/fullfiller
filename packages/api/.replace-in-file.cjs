// every bundle file must start with a shebang
module.exports = {
  files: 'dist/bundle.@(cjs|js)',
  from: /^/,
  to: '#!/usr/bin/env node\n\n',
};
