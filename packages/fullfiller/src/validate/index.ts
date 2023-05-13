import CustomError from 'fullfiller-common/src/CustomError';
import {
  inputType,
  optionsType,
  DeepRequired,
} from 'fullfiller-common/src/types';

import validateFormat from './validateFormat';
import validateInput from './validateInput';
import validateLanguage from './validateLanguage';
import validateQuantity from './validateQuantity';
import validateSentencesPerParagraph from './validateSentencesPerParagraph';
import validateStringify from './validateStringify';
import validateUnit from './validateUnit';
import validateWordsPerSentence from './validateWordsPerSentence';

function validate(
  input: inputType,
  {
    language,
    unit,
    quantity,
    format,
    stringify,
    sentencesPerParagraph,
    wordsPerSentence,
  }: DeepRequired<optionsType>
): void {
  const errors = ([] as string[]).concat(
    validateInput(input),
    validateLanguage(language),
    validateUnit(unit),
    validateQuantity(quantity, unit, sentencesPerParagraph, wordsPerSentence),
    validateFormat(format),
    validateStringify(stringify),
    validateSentencesPerParagraph(sentencesPerParagraph),
    validateWordsPerSentence(wordsPerSentence)
  );

  if (errors.length > 0)
    throw new CustomError(`[ ${errors.join(', ')} ]`, 'fullfiller');
}

export default validate;
