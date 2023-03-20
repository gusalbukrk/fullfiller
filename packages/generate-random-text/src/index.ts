import CustomError from 'fullfiller-common/src/CustomError';
import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import { quantityTooSmall } from 'fullfiller-common/src/errorMessages';
import { freqMapType, optionsType } from 'fullfiller-common/src/types';

import distribute from './distribute';
import generateTextArray from './generateTextArray';
import stringifyTextArray from './stringifyTextArray';

/**
 * Randomly generate text using given `freqMap`.
 * @param freqMap Frequency map.
 * @param options Miscellaneous options. See more at {@link optionsType}.
 * @param stringify If true, return string. Otherwise, return array.
 * @returns Random text.
 */
function generateText(
  freqMap: freqMapType,
  {
    unit = 'paragraphs',
    quantity = unit === 'paragraphs' ? 5 : 200,
    format = 'plain',
    sentencesPerParagraph = sentencesPerParagraphDefault,
    wordsPerSentence = wordsPerSentenceDefault,
  }: optionsType = {},
  stringify = true
): string | string[][][] {
  const sentencesPerParagraphMerged = {
    ...sentencesPerParagraphDefault,
    ...sentencesPerParagraph,
  };
  const wordsPerSentenceMerged = {
    ...wordsPerSentenceDefault,
    ...wordsPerSentence,
  };

  // const wordsPerParagraphMin = wordsPerSentence.min * sentencesPerParagraph.min;
  const minimumQuantityAllowed =
    unit === 'paragraphs'
      ? 1
      : wordsPerSentenceMerged.min * sentencesPerParagraphMerged.min;

  if (quantity < minimumQuantityAllowed) {
    throw new CustomError(
      quantityTooSmall(minimumQuantityAllowed),
      'generate-random-text'
    );
  }

  const distribution = distribute(
    quantity,
    unit,
    sentencesPerParagraphMerged,
    wordsPerSentenceMerged
  );

  const textArray = generateTextArray(freqMap, distribution);

  return stringify ? stringifyTextArray(textArray, format) : textArray;
}

export default generateText;
