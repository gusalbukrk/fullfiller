import stopwords from 'fullfiller-common/src/stopwords.json';
import {
  languagesTypeStopwords,
  languagesType,
} from 'fullfiller-common/src/types';
import weightedRandomness from 'weighted-randomness/src';

import stopwordsF from './stopwords-frequency.json';

function isStopword(
  word: string,
  language: languagesTypeStopwords = 'en'
): boolean {
  return stopwords[language].includes(word.toLowerCase());
}

// must use languagesType instead of languagesTypeStopwords because `stopwords-frequency.json`
// was generated using `tokenize-words` which can't tokenize Japanese, Chinese and Thai
const getRandomStopword = (language: languagesType = 'en') =>
  weightedRandomness(stopwordsF[language]);

export { isStopword, getRandomStopword };
