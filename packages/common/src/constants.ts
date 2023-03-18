import { breakdownOptionType } from './types';

/*
  max must be at least `min * 2 - 1`
  otherwise, min & max couldn't be used to break down any number inside range `max to (min * 2)`

  e.g. if min is 7, max can't be anything less than 13
    - range 7 - 12 = couldn't break down 13
    - range 7 - 11 = couldn't break down 12, 13
    - range 7 - 10 = couldn't break down 11, 12, 13
    - so on...
 */
export const sentencesPerParagraphDefault: breakdownOptionType = {
  min: 4,
  max: 8,
};
//
export const wordsPerSentenceDefault: breakdownOptionType = {
  min: 7,
  max: 13,
};
