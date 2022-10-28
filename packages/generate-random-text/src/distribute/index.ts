import {
  unitType,
  sentencesPerParagraphType,
  wordsPerSentenceType,
} from 'fullfiller-common/src/types';
import { getRandomNumber } from 'fullfiller-common/src/utils';

import breakNumberIntoChunks from './breakNumberIntoChunks';

/**
 *
 * @param quantity Number of specified unit. See more at {@link unitType}.
 * @param unit
 * @param sentencesPerParagraph Contains 2 properties: min & max
 * @param wordsPerSentence Contains 2 properties: min & max
 * @returns Each nested number array is a paragraph, each number is a sentence.
 */
function distribute(
  quantity: number,
  unit: unitType,
  sentencesPerParagraph: sentencesPerParagraphType,
  wordsPerSentence: wordsPerSentenceType
): number[][] {
  const wordsPerParagraphMin = sentencesPerParagraph.min * wordsPerSentence.min;
  const wordsPerParagraphMax = sentencesPerParagraph.max * wordsPerSentence.max;

  // array of numbers
  // each number represents a paragraph (paragraph's quantity of words = number)
  const paragraphsDistribution =
    unit === 'paragraphs'
      ? Array.from({ length: quantity }).map(() =>
          getRandomNumber(wordsPerParagraphMin, wordsPerParagraphMax)
        )
      : breakNumberIntoChunks(
          quantity,
          wordsPerParagraphMin,
          wordsPerParagraphMax,
          Math.ceil(quantity / wordsPerParagraphMax), // paragraphsQuantityMin
          Math.floor(quantity / wordsPerParagraphMin) // paragraphsQuantityMax
        );

  // array containing arrays of numbers
  // each number represents a sentence (sentence's quantity of words = number)
  const sentencesDistribution = paragraphsDistribution.map(
    (wordsPerParagraph) =>
      breakNumberIntoChunks(
        wordsPerParagraph,
        wordsPerSentence.min,
        wordsPerSentence.max,
        Math.max(
          Math.ceil(wordsPerParagraph / wordsPerSentence.max),
          sentencesPerParagraph.min
        ), // sentencesQuantityMin
        Math.min(
          Math.floor(wordsPerParagraph / wordsPerSentence.min),
          sentencesPerParagraph.max
        ) // sentencesQuantityMax
      )
  );

  return sentencesDistribution;
}

export default distribute;
