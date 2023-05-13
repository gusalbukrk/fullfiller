import { getCorrectWordCase } from '../../common/utils';

/**
 * Handles something like 'word.Word', which is very common in Wikipedia API's response.
 * This occurs when a paragraph ends with a citation (i.e. superscript number in brackets).
 *
 * @summary Replace dot with space and fix the case of the word after dot.
 */
function replaceMiddleDotWithSpace(match: string, text: string): string {
  const [, wordBeforeDot, wordAfterDot] = /^(.+)\.(.+)$/.exec(
    match
  ) as unknown as [string, string, string];

  return `${wordBeforeDot} ${getCorrectWordCase(wordAfterDot, text)}`;
}

export default replaceMiddleDotWithSpace;
