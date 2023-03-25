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

export type includeType = Array<keyof articleType>;

export type queriesType = {
  [key: string]: string | number | boolean | undefined;
};

export type optionsType = Partial<{
  unit: unitType;
  quantity: number;
  format: formatType;

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

export type DeepRequired<T> = { [P in keyof T]-?: DeepRequired<T[P]> };
