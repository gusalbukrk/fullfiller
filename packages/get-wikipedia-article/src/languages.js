/**
 * @file Node script to fetch all languages in which Wikipedia is available.
 * Run to update `./languages.json`.
 */

import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url)); // eslint-disable-line no-underscore-dangle

const url =
  'https://commons.wikimedia.org/w/api.php?format=json&action=sitematrix&smtype=language&smlangprop=code|localname|site&smsiteprop=code';

(async () => {
  const languages = Object.values(
    (await (await fetch(url)).json()).sitematrix
  ).reduce(
    (ls, l) =>
      l.site?.some((s) => s.code === 'wiki')
        ? { ...ls, [l.code]: l.localname }
        : ls,
    {}
  );

  fs.writeFileSync(
    join(__dirname, './languages.json'),
    JSON.stringify(languages, undefined, 2)
  );
})();
