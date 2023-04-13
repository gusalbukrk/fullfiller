import { program } from 'commander';
import fullfiller from 'fullfiller/src';
import { unflattenBreakdownOptions } from 'fullfiller-common/src/utils';
import inquirer from 'inquirer';

import pkg from '../package.json';

import 'cross-fetch/dist/node-polyfill';

(async () => {
  program
    .name('fullfiller')
    .description('feature-rich filler text generator')
    .version(pkg.version, '-v, --version')
    .argument('[query]', 'Wikipedia query string') // optional only for interactive mode
    .option('-i, --interactive', 'interactive mode')
    .option('-u, --unit <string>', '`paragraphs` or `words`')
    .option(
      '-q, --quantity <number>',
      'integer, defaults to 5 for `paragraphs` and 200 for `words`',
      parseInt
    )
    .option('-f, --format <string>', '`plain` (default) or `html`')
    .option(
      '--no-stringify', // a negatable boolean (leading 'no-') is true by default
      'return an array instead of string'
    )
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

  if (program.opts().interactive === true) {
    console.log('interactive mode');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'query',
      },
    ]);

    console.log(answers);
  } else {
    const query = program.args[0];
    const options = unflattenBreakdownOptions(program.opts());

    const filler = await fullfiller(query, options);

    // using console.dir instead of console.log because log only show the first 2 levels of depth
    console.dir(filler, { depth: null, colors: true }); // eslint-disable-line no-console
  }
})().catch((e) => console.error(e)); // eslint-disable-line no-console
