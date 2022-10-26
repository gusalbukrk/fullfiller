import { escapeRegExp } from 'fullfiller-common/src/utils';

const escapeAndMakeDotOptional = (str: string) =>
  escapeRegExp(str).replace('\\.', '\\.?');

/* eslint-disable import/prefer-default-export */

/**
 * Convert to lowercase if both are true:
 * - text contain word in lowercase
 * - all capitalized occurrences are preceded by dot or string beginning
 */
export function getCorrectWordCase(
  wordCapitalized: string,
  text: string
): string {
  // check if the first argument really starts with uppercase letter; anything else
  // (e.g.: lowercase letter, number, dot...) won't need to go through this function
  if (!/[A-Z]/.test(wordCapitalized[0])) return wordCapitalized;

  const capitalizedRE = new RegExp(
    `[^.\\s]\\s+${escapeAndMakeDotOptional(wordCapitalized)}(\\s|\\.|$)`
  );
  const textHasCapitalizedWordNotPrecededByDotOrStringBeginning =
    capitalizedRE.test(text);

  const wordLowercase = wordCapitalized.toLowerCase();
  const lowercaseRE = new RegExp(
    `(^|\\s|\\.)${escapeAndMakeDotOptional(wordLowercase)}(\\s|\\.|$)`
  );
  const textContainLowercaseWord = lowercaseRE.test(text);

  const correctCase =
    textContainLowercaseWord &&
    !textHasCapitalizedWordNotPrecededByDotOrStringBeginning
      ? wordLowercase
      : wordCapitalized;

  return correctCase;
}

/* eslint-enable import/prefer-default-export */
