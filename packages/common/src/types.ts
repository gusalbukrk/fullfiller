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

export type sentencesPerParagraphType = {
  min: number;
  max: number;
};

export type wordsPerSentenceType = {
  min: number;
  max: number;
};

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
  sentencesPerParagraph: Partial<sentencesPerParagraphType>;
  wordsPerSentence: Partial<wordsPerSentenceType>;
}>;
