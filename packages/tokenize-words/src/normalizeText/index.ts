import { reduce } from 'fullfiller-common/src/utils';

import handleCapitalizedLetterPrecededByDotOrStringBeginning from './handleCapitalizedLetterPrecededByDotOrStringBeginning';
import preserveRemoveOrReplaceDot from './preserveRemoveOrReplaceDot';
import removeUselessStuff from './removeUselessStuff';
import removeWordsNotContainingAlphanumericChar from './removeWordsNotContainingAlphanumericChar';

function normalizeText(text: string): string {
  const normalized = reduce(text, [
    removeUselessStuff,
    handleCapitalizedLetterPrecededByDotOrStringBeginning,
    preserveRemoveOrReplaceDot,
    removeWordsNotContainingAlphanumericChar,
  ]);

  return normalized;
}

export default normalizeText;
