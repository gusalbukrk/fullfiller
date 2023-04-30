import { getCorrectWordCase } from '../common/utils';

/**
 * Preserve capitalization in words preceded by dot or convert to lowercase.
 */
function handleCapitalizedLetterPrecededByDotOrStringBeginning(
  text: string
): string {
  return text.replace(
    /(?:^|\.\s+)(\p{Lu}\S*)/gu, // capitalizedLetterPrecededByDotOrStringBeginning
    (match: string, wordAfterDot: string, _, whole: string): string =>
      /^[\p{Lu}]+$/u.test(wordAfterDot)
        ? match // if word is acronym (all uppercase), leave as it is
        : match.replace(wordAfterDot, getCorrectWordCase(wordAfterDot, whole))
  );
}

export default handleCapitalizedLetterPrecededByDotOrStringBeginning;
