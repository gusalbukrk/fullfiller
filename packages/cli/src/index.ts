import { program } from 'commander';
import fullfiller from 'fullfiller/src';
import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import {
  unitType,
  flatOptionsType,
  optionsType,
} from 'fullfiller-common/src/types';
import { unflattenBreakdownOptions } from 'fullfiller-common/src/utils';
import inquirer from 'inquirer';

import pkg from '../package.json';

import 'cross-fetch/dist/node-polyfill';

(async () => {
  program
    .name('fullfiller')
    .description('feature-rich filler text generator')
    .version(pkg.version, '-v, --version')
    // optional only for interactive mode; if not provided in normal mode,
    // it's passed to fullfiller as undefined triggering invalidInput error
    .argument('[query]', 'Wikipedia query string')
    .option('-i, --interactive', 'interactive mode')
    .option('-u, --unit <string>', '`paragraphs` or `words`')
    .option(
      '-q, --quantity <number>',
      'integer, defaults to 5 for `paragraphs` and 200 for `words`',
      parseInt
    )
    .option('-f, --format <string>', '`plain` (default) or `html`')
    // a negatable boolean (leading 'no-') without corresponding regular boolean is true by default
    .option('--no-stringify', 'return an array instead of string')
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

  const answers = (program.opts().interactive /* true or undefined */ &&
    (await inquirer.prompt([
      {
        name: 'query',
        validate: (input: string) =>
          input.length !== 0 ? true : 'Please enter a non-empty string.',
      },
      {
        name: 'unit',
        type: 'list',
        choices: ['paragraphs', 'words'],
      },
      {
        name: 'quantity',
        type: 'number',
        default: ({ unit }: { unit: unitType }) =>
          unit === 'paragraphs' ? 5 : 200,
      },
      {
        name: 'format',
        type: 'list',
        choices: ['plain', 'html'],
      },
      {
        name: 'stringify',
        type: 'confirm',
      },
      {
        name: 'sentencesPerParagraphMin',
        type: 'number',
        default: sentencesPerParagraphDefault.min,
      },
      {
        name: 'sentencesPerParagraphMax',
        type: 'number',
        default: sentencesPerParagraphDefault.max,
      },
      {
        name: 'wordsPerSentenceMin',
        type: 'number',
        default: wordsPerSentenceDefault.min,
      },
      {
        name: 'wordsPerSentenceMax',
        type: 'number',
        default: wordsPerSentenceDefault.max,
      },
    ]))) as flatOptionsType & { query: string };

  const { query, ...options } = unflattenBreakdownOptions(
    answers ?? { query: program.args[0], ...program.opts<flatOptionsType>() }
  ) as optionsType & { query: string };

  console.log('\nloading...\n');
  const filler = await fullfiller(query, options);

  // using console.dir instead of console.log because log only show the first 2 levels of depth
  console.dir(filler, { depth: null, colors: true }); // eslint-disable-line no-console
})().catch((e) => console.error(e)); // eslint-disable-line no-console
