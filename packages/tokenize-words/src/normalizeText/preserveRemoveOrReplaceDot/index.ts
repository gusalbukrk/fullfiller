import { isNumeric } from 'fullfiller-common/src/utils';

import handleLeadingDot from './handleLeadingDot';
import handleTrailingDot from './handleTrailingDot';
import replaceMiddleDotWithSpace from './replaceMiddleDotWithSpace';

function replacerBase(
  wordContainingDot: string,
  offset: number,
  whole: string,
  removeStopwords: boolean
) {
  if (/^[.]+$/.test(wordContainingDot)) return '';

  // string containing only numeric values
  if (isNumeric(wordContainingDot)) {
    return wordContainingDot.replace(/\.$/, ''); // preserve dot(s), except trailing
  }

  // preserve or remove leading/trailing dot
  if (
    /^\.|\.$/.test(wordContainingDot) &&
    wordContainingDot.match(/\./g)?.length === 1
  ) {
    return wordContainingDot.startsWith('.')
      ? handleLeadingDot(wordContainingDot, whole, removeStopwords)
      : handleTrailingDot(wordContainingDot, whole, removeStopwords);
  }

  // fix something like `word.Word`
  if (
    /[\p{Ll}\p{Nd}]\.[\p{Lu}\p{Nd}]/u.test(wordContainingDot) &&
    wordContainingDot.match(/\./g)?.length === 1
  ) {
    return replaceMiddleDotWithSpace(wordContainingDot, whole, removeStopwords);
  }

  // else, preserve dot in:
  // - words with multiple dots
  //   - including abbreviations like X.X.X and x.x.
  // - words with dot in the middle that aren't matched previously
  //   - letter before dot is uppercase &/or letter after dot is lowercase

  return wordContainingDot;
}

function preserveRemoveOrReplaceDot(
  text: string,
  removeStopwords: boolean
): string {
  const replacer = (wordContainingDot: string, offset: number, whole: string) =>
    replacerBase(wordContainingDot, offset, whole, removeStopwords);

  return text.replace(
    /\S*\.\S*/g, // word containing dot(s) at any position
    replacer
  );
}

export default preserveRemoveOrReplaceDot;
