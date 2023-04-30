import { escapeRegExp } from 'fullfiller-common/src/utils';
import { isStopword } from 'stopwords-utils/src';

import { getCorrectWordCase } from '../../common/utils';

/**
 * Preserve dot if word containing leading dot occurs more than once.
 */
function handleLeadingDot(
  wordContainingLeadingDot: string,
  text: string,
  removeStopwords: boolean
): string {
  const wordWithoutDot = wordContainingLeadingDot.substring(1);

  if (removeStopwords && isStopword(wordWithoutDot)) return '';

  const doesTextContainsMultipleOccurrences =
    (
      text.match(
        new RegExp(
          `(^|[^\\p{L}\\p{Nd}])${escapeRegExp(
            wordContainingLeadingDot
          )}(?=([^\\p{L}\\p{Nd}]|$))`,
          'gu'
        )
      ) || []
    ).length > 1;

  const correctWordForm = doesTextContainsMultipleOccurrences
    ? wordContainingLeadingDot
    : getCorrectWordCase(wordWithoutDot, text);

  return correctWordForm;
}

export default handleLeadingDot;
