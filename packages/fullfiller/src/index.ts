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
  fillerBodyArrayType,
} from 'fullfiller-common/src/types';
import generateFreqMap from 'generate-words-freqmap/src';
import getWikipediaArticle from 'get-wikipedia-article/src';
import { isStopword } from 'stopwords-utils/src';
import tokenizeWords from 'tokenize-words/src';

import distribute from './distribute';
import loremIpsum from './lorem-ipsum.json';
import populateDistribution from './populateDistribution';
import stringifyBodyArray from './stringifyBodyArray';
import validate from './validate';

function getInputType(
  input: inputType
): 'query' | 'text' | 'wordsArray' | 'freqMap' | undefined {
  if (typeof input === 'string') return 'query';
  if ('body' in input) return 'text';
  if ('words' in input) return 'wordsArray';
  if ('map' in input) return 'freqMap';

  return undefined;
}

/** merge default options with options passed as argument */
function mergeOptions(optionsArg: optionsType): DeepRequired<optionsType> {
  return {
    language: optionsArg.language ?? 'en',
    unit: optionsArg.unit ?? 'paragraphs',
    quantity: optionsArg.quantity ?? (optionsArg.unit === 'words' ? 200 : 5),
    format: optionsArg.format ?? 'plain',
    stringify: optionsArg.stringify ?? true,
    include: optionsArg.include ?? ['title'],
    consistentStart: optionsArg.consistentStart ?? true,

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
 * @param optionsArg Miscellaneous options.
 * @throws Array of errors if arguments validation fails.
 * @returns Filler object containing body and maybe (depending on `include`) title and freqMap.
 */
async function fullfiller(
  input: inputType,
  optionsArg: optionsType = {}
): Promise<fillerType> {
  if (input === ':traditional') {
    const filler = (await fullfiller(
      {
        title: 'Lorem Ipsum',
        words: loremIpsum,
      },
      { ...optionsArg, language: 'la', stringify: false }
    )) as fillerType & { body: fillerBodyArrayType };

    // body must start with "Lorem ipsum dolor sit amet" if consistentStart is true
    const body =
      optionsArg.consistentStart === false
        ? filler.body
        : ([
            [
              // there won't be any duplicate words because none of the words in the array below
              // are included in `lorem-ipsum.json` or `stopwords.json`
              filler.body[0][0].map((w, i) =>
                i < 5
                  ? w.replace(
                      /\w+/, // replace word but keep any punctuation or space
                      ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'][i]
                    )
                  : w
              ),

              ...filler.body[0].slice(1),
            ],

            ...filler.body.slice(1),
          ] as fillerBodyArrayType);

    return {
      ...filler,
      body:
        optionsArg.stringify === false
          ? body
          : stringifyBodyArray(body, optionsArg.format ?? 'plain'),
    };
  }

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
      const article = (await getWikipediaArticle(input as queryInputType, {
        language: options.language,
      })) as Required<Pick<articleType, 'title' | 'body'>>;

    case 'text':
      const wordsArray = tokenizeWords(
        (input as textInputType).body ?? article!.body
      ).filter((w) => !isStopword(w, options.language));

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

      const bodyArray = populateDistribution(
        fm,
        options.language,
        distribution
      );
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
