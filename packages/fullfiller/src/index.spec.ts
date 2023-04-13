import 'cross-fetch/polyfill';

import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import {
  freqMapInputType,
  Overwrite,
  fillerType,
  fillerBodyArrayType,
} from 'fullfiller-common/src/types';
import {
  capitalize,
  isLowercase,
  isNumeric,
  getRandomNumber,
  last,
} from 'fullfiller-common/src/utils';
import { isStopword } from 'stopwords-utils/src';

import article from './article';

import fullfiller from '.';

const removePunctuation = (word: string) =>
  word.replace(/[.!?,:;()[\]"—\s]/g, '');

const freqMapDefault: freqMapInputType = {
  title: 'Lorem Ipsum',
  map: {
    3: ['dolor', 'sit', 'est'],
    7: ['placeholder', 'publishing', 'design', '1914'],
    10: ['filler', 'text', 'latin', '1960'],
    20: ['lorem', 'ipsum'],
  },
};

describe('`fullfiller` returns correct number of paragraphs, sentences and words', () => {
  it.each(Array.from({ length: 10 }, () => [getRandomNumber(1, 20)]))(
    'paragraphs',
    async (quantity) => {
      expect.assertions(1);

      const { body } = await fullfiller(freqMapDefault, {
        quantity,
        stringify: false,
      });
      expect(body).toHaveLength(quantity);
    }
  );

  it.each(
    Array.from({ length: 10 }, () => [
      getRandomNumber(
        sentencesPerParagraphDefault.min * wordsPerSentenceDefault.min, // minimum quantity of words required, otherwise error
        500
      ),
    ])
  )('words', async (quantity) => {
    expect.assertions(1);

    const { body } = (await fullfiller(freqMapDefault, {
      unit: 'words',
      quantity,
      stringify: false,
    })) as Overwrite<fillerType, { body: fillerBodyArrayType }>;

    const wordsCount = body.reduce<number>(
      (acc, paragraph) =>
        acc +
        paragraph.reduce<number>((acc2, sentence) => acc2 + sentence.length, 0),
      0
    );

    expect(wordsCount).toBe(quantity);
  });

  it('sentences per paragraph', async () => {
    expect.assertions(2);

    const { body } = (await fullfiller(freqMapDefault, {
      quantity: 15,
      stringify: false,
    })) as Overwrite<fillerType, { body: fillerBodyArrayType }>;

    const sentencesPerParagraph = body.reduce<number[]>(
      (acc, paragraph) => acc.concat(paragraph.length),
      []
    );

    const min = Math.min(...sentencesPerParagraph);
    expect(min).toBeGreaterThanOrEqual(sentencesPerParagraphDefault.min);

    const max = Math.max(...sentencesPerParagraph);
    expect(max).toBeLessThanOrEqual(sentencesPerParagraphDefault.max);
  });

  it('words per sentence', async () => {
    expect.assertions(2);

    const { body } = (await fullfiller(freqMapDefault, {
      quantity: 10,
      stringify: false,
    })) as Overwrite<fillerType, { body: fillerBodyArrayType }>;

    const wordsPerSentence = body.reduce<number[]>(
      (acc, paragraph) =>
        acc.concat(
          paragraph.reduce<number[]>(
            (acc2, sentence) => acc2.concat(sentence.length),
            []
          )
        ),
      []
    );

    const min = Math.min(...wordsPerSentence);
    expect(min).toBeGreaterThanOrEqual(wordsPerSentenceDefault.min);

    const max = Math.max(...wordsPerSentence);
    expect(max).toBeLessThanOrEqual(wordsPerSentenceDefault.max);
  });
});

describe('`fullfiller` returns text in the chosen format', () => {
  it('format: plain', async () => {
    expect.assertions(1);

    const quantity = 10;

    const text = (
      (await fullfiller(freqMapDefault, { quantity })) as Overwrite<
        fillerType,
        { body: string }
      >
    ).body;
    expect(text.match(/\n/g)).toHaveLength(quantity - 1);
  });

  it('format: html', async () => {
    expect.assertions(2);

    const quantity = 10;

    const text = (
      (await fullfiller(freqMapDefault, {
        quantity,
        format: 'html',
      })) as Overwrite<fillerType, { body: string }>
    ).body;

    expect(text.match(/<p>/g)).toHaveLength(quantity);
    expect(text.match(/<\/p>/g)).toHaveLength(quantity);
  });
});

describe('`fullfiller` returns sentences punctuated and capitalized', () => {
  it('first letter in every sentence is capitalization', async () => {
    expect.assertions(1);

    const allSentencesFirstLettersAreCapitalized = (
      (await fullfiller(freqMapDefault, { stringify: false })) as Overwrite<
        fillerType,
        { body: fillerBodyArrayType }
      >
    ).body.every((paragraph) =>
      paragraph.every(
        (sentence) => sentence[0][0] === sentence[0][0].toUpperCase()
      )
    );

    expect(allSentencesFirstLettersAreCapitalized).toBe(true);
  });

  it('end of sentence punctuation', async () => {
    expect.assertions(1);

    const endOfSentencePunctuation = [
      ...new Set(
        (
          (await fullfiller(freqMapDefault, {
            quantity: 20,
            stringify: false,
          })) as Overwrite<fillerType, { body: fillerBodyArrayType }>
        ).body
          .reduce((acc, paragraph) => acc.concat(paragraph))
          .map((sentence) => last(last(sentence).split('')))
      ),
    ].sort();

    expect(endOfSentencePunctuation).toStrictEqual(['!', '.', '?']);
  });

  it('mid of sentence punctuation', async () => {
    expect.assertions(1);

    const midOfSentencePunctuation = [
      ...new Set(
        (
          (await fullfiller(freqMapDefault, {
            quantity: 40,
            stringify: false,
          })) as Overwrite<fillerType, { body: fillerBodyArrayType }>
        ).body
          .map((paragraph) =>
            paragraph.map((sentence) => sentence.join(' ')).join(' ')
          )
          .join(' ')
          .match(/[()[\]"—,;:]/g)
      ),
    ].sort();

    expect(midOfSentencePunctuation).toStrictEqual([
      '"',
      '(',
      ')',
      ',',
      ':',
      ';',
      '[',
      ']',
      '—',
    ]);
  });

  it("non-enclosing mid punctuation isn't placed between stopwords or numbers", async () => {
    expect.assertions(1);

    const containsNonEnclosingMidOfSentencePunctuation = (word: string) =>
      /[,;:]/.test(word);

    const wordsBetweenPunctuationAreNeitherStopwordsNorNumbers = (
      (await fullfiller(freqMapDefault, {
        quantity: 40,
        stringify: false,
      })) as Overwrite<fillerType, { body: fillerBodyArrayType }>
    ).body
      .reduce((acc, paragraph) => acc.concat(paragraph))
      .every((sentence) =>
        sentence.every((word, index, array) =>
          containsNonEnclosingMidOfSentencePunctuation(word) ||
          (index > 0 &&
            containsNonEnclosingMidOfSentencePunctuation(array[index - 1])) // current word comes after punctuation
            ? !isStopword(word) && !isNumeric(word)
            : true
        )
      );

    expect(wordsBetweenPunctuationAreNeitherStopwordsNorNumbers).toBe(true);
  });

  it("enclosing mid punctuation isn't placed between stopwords", async () => {
    expect.assertions(1);

    const wordsBetweenPunctuationAreNotStopwords = (
      (await fullfiller(freqMapDefault, {
        quantity: 30,
        stringify: false,
      })) as Overwrite<fillerType, { body: fillerBodyArrayType }>
    ).body
      .reduce((acc, paragraph) => acc.concat(paragraph))
      .every((sentence) => {
        const wordsBetweenPunctuation = sentence.reduce<string[]>(
          (acc, word) => {
            if (/^[(["—]/.test(word)) {
              const previousWord = sentence[sentence.indexOf(word) - 1];
              return acc.concat(previousWord, removePunctuation(word));
            }

            if (/[)\]"—]$/.test(word)) {
              const nextWord = sentence[sentence.indexOf(word) + 1];
              return acc.concat(removePunctuation(word), nextWord);
            }

            return acc;
          },
          []
        );

        return wordsBetweenPunctuation.every((word) => !isStopword(word));
      });

    expect(wordsBetweenPunctuationAreNotStopwords).toBe(true);
  });
});

describe('`fullfiller` returns correct word placement', () => {
  let body: fillerBodyArrayType;

  // eslint-disable-next-line jest/no-hooks
  beforeAll(async () => {
    body = (
      (await fullfiller(freqMapDefault, {
        quantity: 25,
        stringify: false,
      })) as Overwrite<fillerType, { body: fillerBodyArrayType }>
    ).body;
  });

  it("there're no more than 2 subsequent stopwords", () => {
    expect.assertions(1);

    const noMoreThan2SubsequentStopwords = body.every((paragraph) =>
      paragraph.every((sentence) =>
        sentence.every((_, index, array) => {
          if (index === 0 || index === array.length - 1) return true;

          return array
            .slice(index - 1, index + 2) // [before, current, after]
            .some((word) => !isStopword(removePunctuation(word)));
        })
      )
    );

    expect(noMoreThan2SubsequentStopwords).toBe(true);
  });

  it("there're no more than 3 subsequent non-stopwords", () => {
    expect.assertions(1);

    const noMoreThan3SubsequentNonStopwords = body.every((paragraph) =>
      paragraph.every((sentence) =>
        sentence.every((_, index, array) => {
          if (index === 0 || index >= array.length - 2) return true;

          return array
            .slice(index - 1, index + 3)
            .some((word) => isStopword(removePunctuation(word)));
        })
      )
    );

    expect(noMoreThan3SubsequentNonStopwords).toBe(true);
  });

  it("sentences doesn't contain duplicate words", () => {
    expect.assertions(1);

    const noDuplicateWords = body.every((paragraph) =>
      paragraph.every((sentence) =>
        sentence
          .map((word, index) =>
            removePunctuation(index === 0 ? word.toLowerCase() : word)
          )
          .every((word, _, array) => {
            const isUnique = (el: string) =>
              array.indexOf(el) === array.lastIndexOf(el);

            return (
              isUnique(word) &&
              // check if there're not multiple instances of the same word with different casing
              (isLowercase(word[0])
                ? isUnique(capitalize(word))
                : isUnique(word.toLowerCase()))
            );
          })
      )
    );

    expect(noDuplicateWords).toBe(true);
  });

  it('sentences neither start nor end with numbers', () => {
    expect.assertions(1);

    const sentencesNeitherStartNorEndWithNumbers = body.every((paragraph) =>
      paragraph.every(
        (sentence) => !isNumeric(sentence[0]) && !isNumeric(last(sentence))
      )
    );

    expect(sentencesNeitherStartNorEndWithNumbers).toBe(true);
  });

  it("sentences doesn't have more than one number", () => {
    expect.assertions(1);

    const noMoreThan1NumberPerSentence = body.every((paragraph) =>
      paragraph.every(
        (sentence) => sentence.filter((word) => isNumeric(word)).length <= 1
      )
    );

    expect(noMoreThan1NumberPerSentence).toBe(true);
  });
});

describe('`fullfiller` handles different input types correctly', () => {
  it.each([
    { type: 'query', input: 'lorem ipsum' },
    { type: 'text', input: article },
  ])(
    'returns correctly (input type: $type)',
    async ({ input }) => {
      expect.assertions(3);

      const filler = await fullfiller(input);

      expect(Object.keys(filler)).toHaveLength(2);
      expect(filler.title).toBe('Lorem ipsum');
      expect(typeof filler.body).toBe('string');
    },
    15000
  );
});
