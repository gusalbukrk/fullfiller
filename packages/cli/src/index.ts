import { program } from 'commander';
import fullfiller from 'fullfiller/src';

import 'cross-fetch/dist/node-polyfill';

program
  .name('fullfiller')
  .description('feature-rich filler text generator')
  .version('0.0.0')
  .requiredOption('-Q, --query <value>', 'Wikipedia query string')
  .option('-u, --unit <value>', '`paragraphs` or `words`')
  .option(
    '-q, --quantity <number>',
    'integer, defaults to 5 for `paragraphs` and 200 for `words`',
    parseInt
  )
  .option('-f, --format <value>', '`plain` (default) or `html`');

program.parse();

const options = program.opts();

(async function cli() {
  const article = await fullfiller(options.query as string, options);

  console.log(article); // eslint-disable-line no-console
})().catch((e) => console.error(e)); // eslint-disable-line no-console
