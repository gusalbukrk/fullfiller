import CustomError from 'fullfiller-common/src/CustomError';
import {
  inputType,
  unitType,
  formatType,
  breakdownOptionType,
} from 'fullfiller-common/src/types';

import validateFormat from './validateFormat';
import validateInput from './validateInput';
import validateQuantity from './validateQuantity';
import validateSentencesPerParagraph from './validateSentencesPerParagraph';
import validateUnit from './validateUnit';
import validateWordsPerSentence from './validateWordsPerSentence';

function validate(
  input: inputType,
  unit: unitType,
  quantity: number,
  format: formatType,
  sentencesPerParagraph: breakdownOptionType,
  wordsPerSentence: breakdownOptionType
): void {
  const errors = ([] as string[]).concat(
    validateInput(input),
    validateUnit(unit),
    validateQuantity(quantity, unit, sentencesPerParagraph, wordsPerSentence),
    validateFormat(format),
    validateSentencesPerParagraph(sentencesPerParagraph),
    validateWordsPerSentence(wordsPerSentence)
  );

  if (errors.length > 0)
    throw new CustomError(`[ ${errors.join(', ')} ]`, 'fullfiller');
}

export default validate;
