import { isStopword } from 'stopwords-utils/src';

import { getCorrectWordCase } from '../../common/utils';

/**
 * Handles something like 'word.Word', which is very common in Wikipedia API's response.
 * This occurs when a paragraph ends with a citation (i.e. superscript number in brackets).
 *
 * @summary Replace dot with space and fix the case of the word after dot.
 */
function replaceMiddleDotWithSpace(
  match: string,
  text: string,
  removeStopwords: boolean
): string {
  const [, wordBeforeDot, wordAfterDot] = /^(.+)\.(.+)$/.exec(
    match
  ) as unknown as [string, string, string];
  if (removeStopwords) {
    const isWordBeforeDotStopword = isStopword(wordBeforeDot);
    const isWordAfterDotStopword = isStopword(wordAfterDot);

    if (isWordBeforeDotStopword && isWordAfterDotStopword) return '';
    if (isWordBeforeDotStopword) return getCorrectWordCase(wordAfterDot, text);
    if (isWordAfterDotStopword) return wordBeforeDot;
  }

  // if removeStopwords is false or neither word is stopword
  return `${wordBeforeDot} ${getCorrectWordCase(wordAfterDot, text)}`;
}

export default replaceMiddleDotWithSpace;
