import { program } from 'commander';
import fullfiller from 'fullfiller/src';
import { unflattenBreakdownOptions } from 'fullfiller-common/src/utils';

import pkg from '../package.json';

import 'cross-fetch/dist/node-polyfill';

(async () => {
  program
    .name('fullfiller')
    .description('feature-rich filler text generator')
    .version(pkg.version, '-v, --version')
    .argument('<query>', 'Wikipedia query string')
    .option('-u, --unit <string>', '`paragraphs` or `words`')
    .option(
      '-q, --quantity <number>',
      'integer, defaults to 5 for `paragraphs` and 200 for `words`',
      parseInt
    )
    .option('-f, --format <string>', '`plain` (default) or `html`')
    .option(
      '--sentencesPerParagraphMin <number>',
      'min quantity of sentences per paragraph',
      parseInt
    )
    .option(
      '--sentencesPerParagraphMax <number>',
      'max quantity of sentences per paragraph',
      parseInt
    )
    .option(
      '--wordsPerSentenceMin <number>',
      'min quantity of words per sentence',
      parseInt
    )
    .option(
      '--wordsPerSentenceMax <number>',
      'max quantity of words per sentence',
      parseInt
    );

  program.parse();

  const query = program.args[0];
  const options = unflattenBreakdownOptions(program.opts());

  const filler = await fullfiller(query, options);

  console.log(filler); // eslint-disable-line no-console
})().catch((e) => console.error(e)); // eslint-disable-line no-console
