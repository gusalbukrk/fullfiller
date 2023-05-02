import { languages } from './constants';

type tier = string[];
/** e.g.: `{ 1: ['foo', 'bar'], 3: ['baz'] }` */
export type freqMapType = {
  // `weight` is a string containing an integer (JS object keys can only be strings and symbols)
  [weight: string]: tier;
};

// input types
export type queryInputType = string;
export type textInputType = { title: string; body: string };
export type wordsArrayInputType = { title: string; words: string[] };
export type freqMapInputType = { title: string; map: freqMapType };
export type inputType =
  | queryInputType
  | textInputType
  | wordsArrayInputType
  | freqMapInputType;

export type unitType = 'paragraphs' | 'words';

export type formatType = 'plain' | 'html';

// previously, there were 2 distinct types that were used for the same purpose
// i.e. sentencesPerParagraphType and wordsPerSentenceType
export type breakdownOptionType = {
  min: number;
  max: number;
};

export type termsType = Partial<{
  alias: string[];
  description: string[];
  label: string[];
}>;

export type articleType = Partial<
  {
    title: string;
    body: string;
    categories: string[];
    links: string[];
    related: string[];
    summary: string;
  } & termsType
>;

export type queriesType = {
  [key: string]: string | number | boolean | undefined;
};

export type includeType = Array<keyof fillerType>;

// languagesType used on `get-wikipedia-article`
export type languagesTypeWikipedia = keyof typeof languages;

// equivalent to `keyof typeof stopwords` (stopwords from `./stopwords.json`)
// which can't be used directly because json can't be packed in declaration file
// error: `RollupError: Could not resolve "./stopwords.json" from "dist/types/index.d.ts"`
export type languagesTypeStopwords =
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

// used on `fullfiller` and `stopwords-utils`'s `getRandomStopword()`
// languages being excluded are languages in which words aren't delimited by space
// and, therefore, can't be segmented using `tokenize-words`
export type languagesType = Exclude<
  languagesTypeWikipedia & languagesTypeStopwords,
  'ja' | 'zh' | 'th'
>;

export type optionsType = Partial<{
  language: languagesType;
  unit: unitType;
  quantity: number;
  format: formatType;
  stringify: boolean;
  include: includeType;

  // breakdown options
  sentencesPerParagraph: Partial<breakdownOptionType>;
  wordsPerSentence: Partial<breakdownOptionType>;
}>;

// in the cli and in the api (specifically in the endpoint which handles route parameters)
// there's no native way to allow for the input of objects
// (although it could be done by accepting a string and parse it into an object)
export type flatOptionsType = Omit<
  optionsType,
  'sentencesPerParagraph' | 'wordsPerSentence'
> &
  Partial<{
    sentencesPerParagraphMin: number;
    sentencesPerParagraphMax: number;
    wordsPerSentenceMin: number;
    wordsPerSentenceMax: number;
  }>;

export type fillerBodyArrayType = string[][][];

// fullfiller return type
export type fillerType = {
  title?: string;
  body: string | fillerBodyArrayType;
  freqMap?: freqMapType;
};

export type DeepRequired<T> = { [P in keyof T]-?: DeepRequired<T[P]> };

/** set to required the key(s) passed as K */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** add or alter (if it already exists) to T the properties of U */
export type Overwrite<T, U> = Omit<T, keyof U> & U;
