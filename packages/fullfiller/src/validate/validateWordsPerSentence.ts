import {
  invalidWordsPerSentence,
  wordsPerSentenceMinTooSmall,
  wordsPerSentenceMaxTooSmall,
  invalidWordsPerSentenceMax,
} from 'fullfiller-common/src/errorMessages';
import { breakdownOptionType } from 'fullfiller-common/src/types';
import { isObject } from 'fullfiller-common/src/utils';

function validateWordsPerSentence(
  wordsPerSentence: breakdownOptionType
): string[] {
  const errors: string[] = [];

  const isWordsPerSentenceValid =
    isObject(wordsPerSentence) &&
    Object.keys(wordsPerSentence).length === 2 &&
    typeof wordsPerSentence.min === 'number' &&
    typeof wordsPerSentence.max === 'number';

  if (!isWordsPerSentenceValid) errors.push(invalidWordsPerSentence);

  if (wordsPerSentence.min < 3) errors.push(wordsPerSentenceMinTooSmall);
  if (wordsPerSentence.max < 3) errors.push(wordsPerSentenceMaxTooSmall);

  if (wordsPerSentence.max < wordsPerSentence.min * 2 - 1)
    errors.push(invalidWordsPerSentenceMax);

  return errors;
}

export default validateWordsPerSentence;
