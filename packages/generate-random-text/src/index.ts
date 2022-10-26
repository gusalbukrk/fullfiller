import CustomError from 'fullfiller-common/src/CustomError';
import { requirementsDefault } from 'fullfiller-common/src/constants';
import { wordsQuantityDoesNotMatchRequirements } from 'fullfiller-common/src/errorMessages';
import {
  freqMapType,
  unitType,
  formatType,
  requirementsType,
} from 'fullfiller-common/src/types';

import distribute from './distribute';
import generateTextArray from './generateTextArray';
import stringifyTextArray from './stringifyTextArray';

type optionsType = {
  unit: unitType;
  quantity: number;
  format: formatType;
  requirements: requirementsType;
};

function getOptionsDefault(unit: unitType = 'paragraphs'): optionsType {
  return {
    unit,

    // default for 'paragraphs' is 5 and for 'words' 200.
    // if neither is supplied, defaults to 5 paragraphs.
    quantity: unit === 'paragraphs' ? 5 : 200,

    format: 'plain',
    requirements: requirementsDefault,
  };
}

/**
 * Randomly generate text using given `freqMap`.
 * @param freqMap Frequency map.
 * @param options Miscellaneous options. See more at {@link optionsType}.
 * @param stringify If true, return string. Otherwise, return array.
 * @returns Random text.
 */
function generateText(
  freqMap: freqMapType,
  options: Partial<optionsType>,
  stringify = true
): string | string[][][] {
  const { unit, quantity, format, requirements } = {
    ...getOptionsDefault(options.unit),
    ...options,
  };

  const wordsPerParagraphMin =
    requirements.wordsPerSentenceMin * requirements.sentencesPerParagraphMin;

  if (unit === 'words' && quantity < wordsPerParagraphMin) {
    throw new CustomError(
      wordsQuantityDoesNotMatchRequirements(quantity, wordsPerParagraphMin),
      'generate-random-text'
    );
  }

  const distribution = distribute(quantity, unit, requirements);

  const textArray = generateTextArray(freqMap, distribution);

  return stringify ? stringifyTextArray(textArray, format) : textArray;
}

export default generateText;
