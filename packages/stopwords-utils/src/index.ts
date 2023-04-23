import stopwords from 'fullfiller-common/src/stopwords.json';
import { languagesTypeSU as languagesType } from 'fullfiller-common/src/types';

function isStopword(word: string, language: languagesType = 'en'): boolean {
  return stopwords[language].includes(word.toLowerCase());
}

function getRandomStopword(language: languagesType = 'en') {
  const sw = stopwords[language];

  return sw[Math.floor(Math.random() * sw.length)];
}

export { isStopword, getRandomStopword };
