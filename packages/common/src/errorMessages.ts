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
export const invalidUnit =
  "Expected `unit` argument to be 'words' or 'paragraphs'.";
export const quantityNotNumber = 'Expected `quantity` argument to be a number.';
export const quantityTooSmall =
  'Expected `quantity` argument to be greater than 28 words / 1 paragraph.';
export const invalidFormat =
  "Expected `format` argument to be 'plain' or 'html'.";
export const invalidRequirements =
  'Expected `requirements` argument to be an object ({ sentencesPerParagraphMin: number, sentencesPerParagraphMax: number, wordsPerSentenceMin: number, wordsPerSentenceMax: number; }).';
export const requirementsValuesTooSmall =
  'Expected all `requirements` properties to be at least 3.';
export const invalidRequirementsSentencesPerParagraph =
  'Expected `requirements.sentencesPerParagraphMax` argument to be at least (sentencesPerParagraphMin * 2 - 1).';
export const invalidRequirementsWordsPerSentence =
  'Expected `requirements.wordsPerSentenceMax` argument to be at least (wordsPerSentenceMin * 2 - 1).';

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

export const wordsQuantityDoesNotMatchRequirements = (
  quantity: number,
  minimum: number
): string =>
  `Given \`quantity\` of words (${quantity}) is lower than the number needed to generate a single paragraph (${minimum}) as defined by \`requirements\` (\`sentencesPerParagraphMin * wordsPerSentenceMin\`).`;
