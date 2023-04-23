import CustomError from 'fullfiller-common/src/CustomError';
import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import { invalidInput } from 'fullfiller-common/src/errorMessages';
import {
  inputType,
  queryInputType,
  textInputType,
  wordsArrayInputType,
  optionsType,
  freqMapInputType,
  articleType,
  DeepRequired,
  fillerType,
} from 'fullfiller-common/src/types';
import generateFreqMap from 'generate-words-freqmap/src';
import getWikipediaArticle from 'get-wikipedia-article/src';
import tokenizeWords from 'tokenize-words/src';

import distribute from './distribute';
import populateDistribution from './populateDistribution';
import stringifyBodyArray from './stringifyBodyArray';
import validate from './validate';

/** @returns one of the possible input types. See more at {@link inputType}. */
function getInputType(
  input: inputType
): 'query' | 'text' | 'wordsArray' | 'freqMap' | undefined {
  if (typeof input === 'string') return 'query';
  if ('body' in input) return 'text';
  if ('words' in input) return 'wordsArray';
  if ('map' in input) return 'freqMap';

  return undefined;
}

// merge default options with options passed as argument
function mergeOptions(optionsArg: optionsType): DeepRequired<optionsType> {
  return {
    language: optionsArg.language ?? 'en',
    unit: optionsArg.unit ?? 'paragraphs',
    quantity: optionsArg.quantity ?? (optionsArg.unit === 'words' ? 200 : 5),
    format: optionsArg.format ?? 'plain',
    stringify: optionsArg.stringify ?? true,
    include: optionsArg.include ?? ['title'],

    sentencesPerParagraph: {
      ...sentencesPerParagraphDefault,
      ...optionsArg.sentencesPerParagraph,
    },

    wordsPerSentence: {
      ...wordsPerSentenceDefault,
      ...optionsArg.wordsPerSentence,
    },
  };
}

/**
 * Feature-rich filler text generator.
 * @param input Filler text will be generated from this parameter.
 * @param options Miscellaneous options.
 * @param include What should be included on the output besides the body.
 * @returns Filler object containing body and maybe (depending on include) title and freqMap.
 */
async function fullfiller(
  input: inputType,
  optionsArg: optionsType = {}
): Promise<fillerType> {
  const options = mergeOptions(optionsArg);

  validate(input, options);

  /*
    eslint-disable
      @typescript-eslint/no-unnecessary-type-assertion,
      @typescript-eslint/no-non-null-assertion,
      no-case-declarations,
      no-fallthrough
  */
  switch (getInputType(input)) {
    case 'query':
      const article = (await getWikipediaArticle(
        input as queryInputType
      )) as Required<Pick<articleType, 'title' | 'body'>>;

    case 'text':
      const wordsArray = tokenizeWords(
        (input as textInputType).body ?? article!.body
      );

    case 'wordsArray':
      const freqMap = generateFreqMap(
        (input as wordsArrayInputType).words ?? wordsArray!
      );

    case 'freqMap':
      const fm = (input as freqMapInputType).map ?? freqMap!;

      const distribution = distribute(
        options.quantity,
        options.unit,
        options.sentencesPerParagraph,
        options.wordsPerSentence
      );

      const bodyArray = populateDistribution(fm, distribution);
      const body = options.stringify
        ? stringifyBodyArray(bodyArray, options.format)
        : bodyArray;

      return {
        ...(options.include.includes('title')
          ? {
              title:
                (
                  input as
                    | textInputType
                    | wordsArrayInputType
                    | freqMapInputType
                ).title ?? article!.title,
            }
          : {}),

        body,

        ...(options.include.includes('freqMap') ? { freqMap: fm } : {}),
      };

    default:
      throw new CustomError(invalidInput, 'fullfiller');
  }
  /*
    eslint-enable
      @typescript-eslint/no-unnecessary-type-assertion,
      @typescript-eslint/no-non-null-assertion,
      no-case-declarations,
      no-fallthrough
  */
}

export default fullfiller;
