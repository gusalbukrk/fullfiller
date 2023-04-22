import stopwords from './stopwords.json';

// can't use `keyof typeof stopwords` because json can't be packed in declaration file
// error: `RollupError: Could not resolve "./stopwords.json" from "dist/types/index.d.ts"`
type languagesType =
  | 'af'
  | 'ar'
  | 'bg'
  | 'bn'
  | 'br'
  | 'ca'
  | 'cs'
  | 'da'
  | 'de'
  | 'el'
  | 'en'
  | 'eo'
  | 'es'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fr'
  | 'ga'
  | 'gl'
  | 'ha'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hu'
  | 'hy'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'la'
  | 'lv'
  | 'mr'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sl'
  | 'so'
  | 'st'
  | 'sv'
  | 'sw'
  | 'th'
  | 'tr'
  | 'yo'
  | 'zh'
  | 'zu';

function isStopword(word: string, language: languagesType = 'en'): boolean {
  return stopwords[language].includes(word.toLowerCase());
}

function getRandomStopword(language: languagesType = 'en') {
  const sw = stopwords[language];

  return sw[Math.floor(Math.random() * sw.length)];
}

export { languagesType, isStopword, getRandomStopword };
