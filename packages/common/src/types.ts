import { wikipediaLanguages } from './constants';

type tier = string[];

/**
 * @property `weight` is a string containing a number
 * @example { 1: ['bar', 'baz'], 3: ['foo'] }
 */
export type freqMapType = {
  [weight: string]: tier;
};

// input types
export type specialKeywordInputType = ':traditional' | ':popular' | ':random';
export type queryInputType = string;
export type textInputType = { title: string; body: string };
export type wordsArrayInputType = { title: string; words: string[] };
export type freqMapInputType = { title: string; map: freqMapType };

/**
 * valid input types: special keyword, Wikipedia query string, text, words array and frequency map
 */
export type inputType =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | specialKeywordInputType
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

// languageType used on `get-wikipedia-article`
export type wikipediaLanguageType = keyof typeof wikipediaLanguages;

// languageType used on `stopwords-utils`'s `isStopword()`
// subset of wikipediaLanguageType
// Wikipedia supports 300+ languages but `stopwords.json` only contains stopwords for 50 languages
// equivalent to `keyof typeof stopwords` (stopwords from `./stopwords.json`)
// which can't be used directly because json can't be packed in declaration files
// error: `RollupError: Could not resolve "./stopwords.json" from "dist/types/index.d.ts"`
export type stopwordsLanguageType =
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

// used on `fullfiller` and `stopwords-utils`'s `generateGetRandomStopwordsFn()`
// subset of stopwordsLanguageType
// languages being excluded are languages in which words aren't delimited by space
// and, therefore, can't be segmented using `tokenize-words`
export type languageType = Exclude<
  wikipediaLanguageType & stopwordsLanguageType,
  'ja' | 'zh' | 'th'
>;

export type optionsType = Partial<{
  language: languageType;
  unit: unitType;
  quantity: number;
  format: formatType;
  stringify: boolean;
  include: includeType;
  consistentStart: boolean; // ignored when input is anything other than ':traditional'

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

/** `fullfiller`'s return type */
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
