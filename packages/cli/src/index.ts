import { program } from 'commander';
import fullfiller from 'fullfiller/src';
import { unitType, formatType, optionsType } from 'fullfiller-common/src/types';

import 'cross-fetch/dist/node-polyfill';

program
  .name('fullfiller')
  .description('feature-rich filler text generator')
  .version('0.0.0')
  .requiredOption('-Q, --query <string>', 'Wikipedia query string')
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

const opts = program.opts();

(async function cli() {
  const { query } = opts;

  const options: Partial<optionsType> = {
    ...(opts.unit !== undefined ? { unit: opts.unit as unitType } : {}),
    ...(opts.quantity !== undefined
      ? { quantity: opts.quantity as number }
      : {}),
    ...(opts.format !== undefined ? { format: opts.format as formatType } : {}),

    sentencesPerParagraph: {},
    wordsPerSentence: {},
  };

  /* eslint-disable @typescript-eslint/no-non-null-assertion */

  if (opts.sentencesPerParagraphMin !== undefined)
    options.sentencesPerParagraph!.min =
      opts.sentencesPerParagraphMin as number;

  if (opts.sentencesPerParagraphMax !== undefined)
    options.sentencesPerParagraph!.max =
      opts.sentencesPerParagraphMax as number;

  if (opts.wordsPerSentenceMin !== undefined)
    options.wordsPerSentence!.min = opts.wordsPerSentenceMin as number;

  if (opts.wordsPerSentenceMax !== undefined)
    options.wordsPerSentence!.max = opts.wordsPerSentenceMax as number;

  /* eslint-disable @typescript-eslint/no-non-null-assertion */

  const article = await fullfiller(query as string, options);

  console.log(article); // eslint-disable-line no-console
})().catch((e) => console.error(e)); // eslint-disable-line no-console
