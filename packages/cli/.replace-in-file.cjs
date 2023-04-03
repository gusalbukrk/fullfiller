module.exports = {
  // it's not possible to make different replacements in different files
  // https://github.com/adamreisnz/replace-in-file/issues/119#issuecomment-643824765
  files: 'dist/bundle.@(cjs|js)',

  // first replacement: for some unknown reason, `string_decoder` import
  // appears twice and one of them has a trailing forward slash
  // would result in an error, because relative ESM imports must use full paths
  //
  // second replacement: every bundle file must start with a shebang
  from: [/^import (.*) from 'string_decoder\/';$/gm, /^/],
  to: ["import $1 from 'string_decoder';", '#!/usr/bin/env node\n\n'],
};
