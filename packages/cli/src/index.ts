import { join } from 'path';

import cache from 'cacache';
import { program } from 'commander';
import findCacheDir from 'find-cache-dir';
import fullfillerBase from 'fullfiller/src';
import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import {
  unitType,
  flatOptionsType,
  optionsType,
  freqMapType,
  queryInputType,
  inputType,
  fillerType,
} from 'fullfiller-common/src/types';
import {
  unflattenBreakdownOptions,
  parseIntR10,
} from 'fullfiller-common/src/utils';
import inquirer from 'inquirer';

import pkg from '../package.json';

import 'cross-fetch/dist/node-polyfill';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const base = findCacheDir({ name: 'fullfiller-api' })!;
const queriesCacheDir = join(base, 'queries');
const freqMapsCacheDir = join(base, 'freqMaps');

async function getFreqMapsCacheRecord(
  queriesCacheKey: string
): Promise<
  | { freqMapsCacheKey: string; freqMapsCacheValue: freqMapType }
  | Record<string, never>
> {
  // first, check if freqMaps cache has a record with key equal to queriesCacheKey
  // it happens when user query is exactly equal to a Wikipedia article title
  // in this case, get freqMap directly from freqMapsCache instead of querying queriesCache first
  const directFreqMapsCacheValue = await cache
    .get(freqMapsCacheDir, queriesCacheKey)
    .catch(() => undefined);
  //
  if (directFreqMapsCacheValue !== undefined) {
    return {
      freqMapsCacheKey: queriesCacheKey,
      freqMapsCacheValue: JSON.parse(
        directFreqMapsCacheValue.data.toString()
      ) as freqMapType,
    };
  }

  // otherwise, check for a queries cache record with key equal to queriesCacheKey
  // which, if found, will have a value equal to the freqMaps cache key

  const queriesCacheValue = await cache
    .get(queriesCacheDir, queriesCacheKey)
    .catch(() => undefined); // otherwise, error is thrown if cache record doesn't exist

  if (queriesCacheValue === undefined) return {};

  const freqMapsCacheKey = queriesCacheValue.data.toString();

  const freqMapsCacheValue = JSON.parse(
    (await cache.get(freqMapsCacheDir, freqMapsCacheKey)).data.toString()
  ) as freqMapType;

  return { freqMapsCacheKey, freqMapsCacheValue };
}

// fullfiller with file system caching capabilities
async function fullfiller(
  query: queryInputType,
  options: optionsType
): Promise<fillerType> {
  const queriesCacheKey = `${options.language ?? 'en'} - ${query}`;

  const { freqMapsCacheKey, freqMapsCacheValue } =
    (await getFreqMapsCacheRecord(queriesCacheKey)) || {};

  const filler = await fullfillerBase(
    ...((freqMapsCacheValue === undefined
      ? [
          query,
          {
            ...options,
            include: ['title', 'body', 'freqMap'],
          },
        ]
      : [
          {
            title: freqMapsCacheKey.replace(/^[a-z]{2,} - /, ''),
            map: freqMapsCacheValue,
          },
          options,
        ]) as [inputType, optionsType])
  );

  // create cache records if they don't yet exist
  if (freqMapsCacheValue === undefined && query !== ':traditional') {
    console.log('\nloading...\n'); // eslint-disable-line no-console

    // also is the freqMapsCacheKey for the new freqMaps cache record
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const queriesCacheValue = `${options.language ?? 'en'} - ${filler.title!}`;

    if (
      queriesCacheKey !== queriesCacheValue &&
      !/^[a-z]{2,} - :(popular|random)/.test(queriesCacheKey)
    ) {
      await cache.put(queriesCacheDir, queriesCacheKey, queriesCacheValue);
    }

    // freqMap may be already in cache if it was requested using another query
    if (
      (await cache
        .get(freqMapsCacheDir, queriesCacheValue)
        .catch(() => undefined)) === undefined
    ) {
      await cache.put(
        freqMapsCacheDir,
        queriesCacheValue,
        JSON.stringify(filler.freqMap)
      );
    }
  }

  return filler;
}

(async () => {
  program
    .name('fullfiller')
    .description('feature-rich filler text generator')
    .version(pkg.version, '-v, --version')
    // optional only for interactive mode; if not provided in normal mode,
    // it's passed to fullfiller as undefined triggering invalidInput error
    .argument('[query]', 'Wikipedia query string')
    .option('-i, --interactive', 'interactive mode')
    .option(
      '-l, --language <string>',
      'language code, e.g. `en`, `es`, `pt`, ...'
    )
    .option('-u, --unit <string>', '`paragraphs` or `words`')
    .option(
      '-q, --quantity <number>',
      'integer, defaults to 5 for `paragraphs` and 200 for `words`',
      parseIntR10
    )
    .option('-f, --format <string>', '`plain` (default) or `html`')
    // a negatable boolean (leading 'no-') without corresponding regular boolean is true by default
    .option('--no-stringify', 'return an array instead of string')
    .option(
      '--sentencesPerParagraphMin <number>',
      'min quantity of sentences per paragraph',
      parseIntR10
    )
    .option(
      '--sentencesPerParagraphMax <number>',
      'max quantity of sentences per paragraph',
      parseIntR10
    )
    .option(
      '--wordsPerSentenceMin <number>',
      'min quantity of words per sentence',
      parseIntR10
    )
    .option(
      '--wordsPerSentenceMax <number>',
      'max quantity of words per sentence',
      parseIntR10
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
        name: 'language',
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

  const filler = await fullfiller(query, options);

  // using console.dir instead of console.log because log only show the first 2 levels of depth
  console.dir(filler, { depth: null, colors: true }); // eslint-disable-line no-console
})().catch((e) => console.error(e)); // eslint-disable-line no-console
