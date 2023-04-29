import { reduce } from 'fullfiller-common/src/utils';

import handleCapitalizedLetterPrecededByDotOrStringBeginning from './handleCapitalizedLetterPrecededByDotOrStringBeginning';
import preserveRemoveOrReplaceDotBase from './preserveRemoveOrReplaceDot';
import removeUselessStuffBase from './removeUselessStuff';
import removeWordsNotContainingAlphanumericChar from './removeWordsNotContainingAlphanumericChar';

function normalizeText(text: string, removeStopwords: boolean): string {
  const removeUselessStuff = (string: string) =>
    removeUselessStuffBase(string, removeStopwords);

  const preserveRemoveOrReplaceDot = (t: string) =>
    preserveRemoveOrReplaceDotBase(t, removeStopwords);

  const normalized = reduce(text, [
    removeUselessStuff,
    handleCapitalizedLetterPrecededByDotOrStringBeginning,
    preserveRemoveOrReplaceDot,
    removeWordsNotContainingAlphanumericChar,
  ]);

  return normalized;
}

export default normalizeText;
