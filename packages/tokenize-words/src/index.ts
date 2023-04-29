import CustomError from 'fullfiller-common/src/CustomError';
import { notEnoughWordsInWordsArray } from 'fullfiller-common/src/errorMessages';

import normalizeText from './normalizeText';

type optionsType = Partial<{
  lengthMin: number;
  removeStopwords: boolean;
}>;

const optionsDefault: Required<optionsType> = {
  lengthMin: 0, // don't error even if return array is empty
  removeStopwords: true,
};

/**
 * Break down text string into array of words.
 * @param text
 * @param optionsArg Miscellaneous options. See more at {@link optionsType}.
 * @throws Error if `wordsArray` length is less than `options.lengthMin`.
 * @returns Array of words.
 */
function tokenizeWords(text: string, optionsArg: optionsType = {}): string[] {
  const options = { ...optionsDefault, ...optionsArg };

  const wordsArray =
    normalizeText(text, options.removeStopwords).match(/\S+/g) || [];

  const wordsArrayLength = wordsArray.length;

  if (wordsArrayLength < options.lengthMin) {
    throw new CustomError(
      notEnoughWordsInWordsArray(options.lengthMin, wordsArrayLength),
      'tokenize-words'
    );
  }

  return wordsArray;
}

export default tokenizeWords;
