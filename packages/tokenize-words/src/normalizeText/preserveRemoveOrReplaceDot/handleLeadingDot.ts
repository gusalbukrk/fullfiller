import { escapeRegExp } from 'fullfiller-common/src/utils';
import { isStopword } from 'stopwords-utils/src';

import { getCorrectWordCase } from '../../common/utils';

/**
 * Preserve dot if word containing leading dot occurs more than once.
 */
function handleLeadingDot(
  wordContainingLeadingDot: string,
  text: string
): string {
  const wordWithoutDot = wordContainingLeadingDot.substring(1);

  if (isStopword(wordWithoutDot)) return '';

  const doesTextContainsMultipleOccurrences =
    (
      text.match(
        new RegExp(
          `(^|\\W)${escapeRegExp(wordContainingLeadingDot)}(?=(\\W|$))`,
          'g'
        )
      ) || []
    ).length > 1;

  const correctWordForm = doesTextContainsMultipleOccurrences
    ? wordContainingLeadingDot
    : getCorrectWordCase(wordWithoutDot, text);

  return correctWordForm;
}

export default handleLeadingDot;
