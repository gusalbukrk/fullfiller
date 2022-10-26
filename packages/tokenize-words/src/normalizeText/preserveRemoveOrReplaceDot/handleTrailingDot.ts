import { escapeRegExp } from 'fullfiller-common/src/utils';
import { isStopword } from 'stopwords-utils/src';

function shouldPreserveTrailingDot(
  wordContainingTrailingDot: string,
  text: string
) {
  const wordWithoutDot = wordContainingTrailingDot.replace(/\.$/, '');

  const wordWithDotNumberOfOccurrences = (
    text.match(
      new RegExp(
        `(^|\\s)${escapeRegExp(wordContainingTrailingDot)}(?=\\s|$)`,
        'g'
      )
    ) || []
  ).length;

  if (wordWithDotNumberOfOccurrences === 1) return false;

  const wordWithoutDotNumberOfOccurrences = (
    text.match(
      new RegExp(`(^|\\s)${escapeRegExp(wordWithoutDot)}(?=\\s|$)`, 'g')
    ) || []
  ).length;

  return wordWithDotNumberOfOccurrences > wordWithoutDotNumberOfOccurrences;
}

/**
 * Preserve dot if word containing trailing dot happens more
 * than once and more often than word without trailing dot.
 */
function handleTrailingDot(
  wordContainingTrailingDot: string,
  text: string
): string {
  const wordWithoutDot = wordContainingTrailingDot.slice(0, -1);

  if (isStopword(wordWithoutDot)) return '';

  const preserveTrailingDot = shouldPreserveTrailingDot(
    wordContainingTrailingDot,
    text
  );

  const handled = preserveTrailingDot
    ? wordContainingTrailingDot
    : wordWithoutDot;

  return handled;
}

export default handleTrailingDot;
