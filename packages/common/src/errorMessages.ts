// messages aren't inside an object because
// tree-shaking isn't possible when exporting an object
// https://medium.com/@rauschma/note-that-default-exporting-objects-is-usually-an-anti-pattern-if-you-want-to-export-the-cf674423ac38#.nibatprx3

// used at `fullfiller/src/validate`
export const invalidInput =
  'Expected `input` argument to be one of the valid types (query string, text, words array or frequency map).';
export const emptyQueryString =
  'Expected non-empty query string at `input` argument.';
export const textTooShort =
  'Expected given text (in `input.body` argument) to have at least 150 words.';
//
export const invalidStopwordsLanguage = (
  language: string,
  languages: string[]
) =>
  `Expected \`language\` argument to be one of the supported languages (${languages.join(
    ', '
  )}).`;
//
export const invalidUnit =
  'Expected `unit` argument to be `words` or `paragraphs`.';
//
export const quantityNotNumber = 'Expected `quantity` argument to be a number.';
export const quantityTooSmall = (wordsMinimum: number) =>
  `Expected \`quantity\` argument to be greater than 1 paragraph / ${wordsMinimum} words.`;
//
export const invalidFormat =
  'Expected `format` argument to be `plain` or `html`.';
//
export const invalidStringify =
  'Expected `stringify` argument to be a boolean (`true` or `false`).';
//
export const invalidSentencesPerParagraph =
  'Expected `sentencesPerParagraph` argument to be an object (`{ min: number, max: number }`).';
export const sentencesPerParagraphMinTooSmall =
  'Expected `sentencesPerParagraph.min` argument to be at least 3.';
export const sentencesPerParagraphMaxTooSmall =
  'Expected `sentencesPerParagraph.max` argument to be at least 3.';
export const invalidSentencesPerParagraphMax =
  'Expected `sentencesPerParagraph.max` to be at least `sentencesPerParagraph.min * 2 - 1`.';
//
export const invalidWordsPerSentence =
  'Expected `wordsPerSentence` argument to be an object (`{ min: number, max: number }`).';
export const wordsPerSentenceMinTooSmall =
  'Expected `wordsPerSentence.min` argument to be at least 3.';
export const wordsPerSentenceMaxTooSmall =
  'Expected `wordsPerSentence.max` argument to be at least 3.';
export const invalidWordsPerSentenceMax =
  'Expected `wordsPerSentence.max` to be at least `wordsPerSentence.min * 2 - 1`.';

export const articleNotFound =
  'Wikipedia does not have an article with this exact title. Try again using a different query.';

export const articleIsDisambiguation = (suggestions: string[]): string =>
  `This query points to a Wikipedia disambiguation page. You've got to be more specific.${
    suggestions.length > 0
      ? ` Query suggestions:\n- ${suggestions.splice(0, 10).join('\n- ')}.`
      : ` No query suggestions were found.`
  }`;

export const notEnoughWordsInWordsArray = (
  minimum: number,
  received: number
): string =>
  `Given \`text\` doesn't have enough keywords to construct \`wordsArray\` containing the minimum quantity of words required. Minimum number of words required: ${minimum}. Number of words received: ${received}.`;

export const notEnoughWordsInFreqMap = (
  minimum: number,
  received: number
): string =>
  `Given \`wordsArray\` doesn't have enough words to construct \`freqMap\` containing the minimum quantity of words required. Minimum number of words required: ${minimum}. Number of words received: ${received}.`;
