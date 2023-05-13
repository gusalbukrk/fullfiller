import stopwords from 'fullfiller-common/src/stopwords.json';
import {
  stopwordsLanguageType,
  languageType,
} from 'fullfiller-common/src/types';
import weightedRandomness from 'weighted-randomness/src';

import stopwordsF from './stopwords-frequency.json';

function isStopword(
  word: string,
  language: stopwordsLanguageType = 'en'
): boolean {
  return stopwords[language].includes(word.toLowerCase());
}

// must use languageType instead of stopwordsLanguageType because `stopwords-frequency.json`
// was generated using `tokenize-words` which can't tokenize Japanese, Chinese and Thai
const generateGetRandomStopwordFn = (language: languageType = 'en') =>
  weightedRandomness(stopwordsF[language]);

export { isStopword, generateGetRandomStopwordFn };
