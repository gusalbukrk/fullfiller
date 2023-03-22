import CustomError from 'fullfiller-common/src/CustomError';
import {
  inputType,
  optionsType,
  DeepRequired,
} from 'fullfiller-common/src/types';

import validateFormat from './validateFormat';
import validateInput from './validateInput';
import validateQuantity from './validateQuantity';
import validateSentencesPerParagraph from './validateSentencesPerParagraph';
import validateUnit from './validateUnit';
import validateWordsPerSentence from './validateWordsPerSentence';

function validate(
  input: inputType,
  {
    unit,
    quantity,
    format,
    sentencesPerParagraph,
    wordsPerSentence,
  }: DeepRequired<optionsType>
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
