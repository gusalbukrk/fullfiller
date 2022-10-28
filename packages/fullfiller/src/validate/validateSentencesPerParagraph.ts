import {
  invalidSentencesPerParagraph,
  sentencesPerParagraphMinTooSmall,
  sentencesPerParagraphMaxTooSmall,
  invalidSentencesPerParagraphMax,
} from 'fullfiller-common/src/errorMessages';
import { sentencesPerParagraphType } from 'fullfiller-common/src/types';
import { isObject } from 'fullfiller-common/src/utils';

function validateSentencesPerParagraph(
  sentencesPerParagraph: sentencesPerParagraphType
): string[] {
  const errors: string[] = [];

  const isSentencesPerParagraphValid =
    isObject(sentencesPerParagraph) &&
    Object.keys(sentencesPerParagraph).length === 2 &&
    typeof sentencesPerParagraph.min === 'number' &&
    typeof sentencesPerParagraph.max === 'number';

  if (!isSentencesPerParagraphValid) errors.push(invalidSentencesPerParagraph);

  if (sentencesPerParagraph.min < 3)
    errors.push(sentencesPerParagraphMinTooSmall);
  if (sentencesPerParagraph.max < 3)
    errors.push(sentencesPerParagraphMaxTooSmall);

  if (sentencesPerParagraph.max < sentencesPerParagraph.min * 2 - 1)
    errors.push(invalidSentencesPerParagraphMax);

  return errors;
}

export default validateSentencesPerParagraph;
