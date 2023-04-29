import { isStopword } from 'stopwords-utils/src';

function preserveCommaOrColonIfSurroundedByNumbers(
  _: string,
  before: string,
  commaOrColon: string,
  after: string
) {
  const isCommaOrColonSurroundedByNumbers = [before, after].every((char) =>
    /^\d$/.test(char)
  );

  const preserved = before + commaOrColon;
  const removed = `${before} `;

  return isCommaOrColonSurroundedByNumbers ? preserved : removed;
}

function removeUselessStuff(string: string, removeStopwords: boolean): string {
  const removed = string
    // remove useless punctuation
    // `.?!,:;-–—<>[]{}()'"…` = 15 punctuations signs in english
    // em dash/en dash and opening/closing are counted as the same
    // only hyphen & apostrophe will be always preserved
    // single dot will be handled at `preserveRemoveOrReplaceDot` function
    .replace(/["()[\]{}<>–—;?!]+/g, ' ')
    .replace(/(^|.)(,|:)(?=(.|$))/g, preserveCommaOrColonIfSurroundedByNumbers)
    .replace(/\.{2,}|…/g, ' ')

    // remove line breaks
    .replace(/\n+/g, ' ')

    // remove stopwords
    .replace(/\S+/g, (match: string) =>
      removeStopwords && isStopword(match) ? '' : match
    )

    // remove space between initials
    .replace(
      /(^|\s)([A-Z]\.(\s|$)){2,}/g,
      (initials: string) => ` ${initials.replace(/\s/g, '')} `
    );

  return removed;
}

export default removeUselessStuff;
