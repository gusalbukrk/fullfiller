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

export type requirementsType = {
  sentencesPerParagraphMin: number;
  sentencesPerParagraphMax: number;
  wordsPerSentenceMin: number;
  wordsPerSentenceMax: number;
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

export type optionsType = {
  bodyFormat: 'html' | 'plain';
};

export type queriesType = {
  [key: string]: string | number | boolean | undefined;
};
