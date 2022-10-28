import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import { freqMapType } from 'fullfiller-common/src/types';
import {
  capitalize,
  isLowercase,
  isNumeric,
  getRandomNumber,
  last,
} from 'fullfiller-common/src/utils';
import { isStopword } from 'stopwords-utils/src';

import generateText from '.';

const removePunctuation = (word: string) =>
  word.replace(/[.!?,:;()[\]"—\s]/g, '');

const freqMapDefault: freqMapType = {
  3: ['dolor', 'sit', 'est'],
  7: ['placeholder', 'publishing', 'design', '1914'],
  10: ['filler', 'text', 'latin', '1960'],
  20: ['lorem', 'ipsum'],
};

describe('`generateText` returns correct number of paragraphs, sentences and words', () => {
  it.each(Array.from({ length: 10 }, () => [getRandomNumber(1, 20)]))(
    'paragraphs',
    (quantity) => {
      expect.assertions(1);

      const textArray = generateText(freqMapDefault, { quantity }, false);
      expect(textArray).toHaveLength(quantity);
    }
  );

  it.each(
    Array.from({ length: 10 }, () => [
      getRandomNumber(
        sentencesPerParagraphDefault.min * wordsPerSentenceDefault.min, // minimum quantity of words required, otherwise error
        500
      ),
    ])
  )('words', (quantity) => {
    expect.assertions(1);

    const textArray = generateText(
      freqMapDefault,
      {
        unit: 'words',
        quantity,
      },
      false
    ) as string[][][];

    const wordsCount = textArray.reduce<number>(
      (acc, paragraph) =>
        acc +
        paragraph.reduce<number>((acc2, sentence) => acc2 + sentence.length, 0),
      0
    );

    expect(wordsCount).toBe(quantity);
  });

  it('sentences per paragraph', () => {
    expect.assertions(2);

    const textArray = generateText(
      freqMapDefault,
      { quantity: 15 },
      false
    ) as string[][][];

    const sentencesPerParagraph = textArray.reduce<number[]>(
      (acc, paragraph) => acc.concat(paragraph.length),
      []
    );

    const min = Math.min(...sentencesPerParagraph);
    expect(min).toBeGreaterThanOrEqual(sentencesPerParagraphDefault.min);

    const max = Math.max(...sentencesPerParagraph);
    expect(max).toBeLessThanOrEqual(sentencesPerParagraphDefault.max);
  });

  it('words per sentence', () => {
    expect.assertions(2);

    const textArray = generateText(
      freqMapDefault,
      { quantity: 10 },
      false
    ) as string[][][];

    const wordsPerSentence = textArray.reduce<number[]>(
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

describe('`generateText` returns text in the chosen format', () => {
  it('format: plain', () => {
    expect.assertions(1);

    const quantity = 10;

    const text = generateText(freqMapDefault, { quantity }) as string;
    expect(text.match(/\n/g)).toHaveLength(quantity - 1);
  });

  it('format: html', () => {
    expect.assertions(2);

    const quantity = 10;

    const text = generateText(freqMapDefault, {
      quantity,
      format: 'html',
    }) as string;

    expect(text.match(/<p>/g)).toHaveLength(quantity);
    expect(text.match(/<\/p>/g)).toHaveLength(quantity);
  });
});

describe('`generateText` returns sentences punctuated and capitalized', () => {
  it('first letter in every sentence is capitalization', () => {
    expect.assertions(1);

    const allSentencesFirstLettersAreCapitalized = (
      generateText(freqMapDefault, {}, false) as string[][][]
    ).every((paragraph) =>
      paragraph.every(
        (sentence) => sentence[0][0] === sentence[0][0].toUpperCase()
      )
    );

    expect(allSentencesFirstLettersAreCapitalized).toBe(true);
  });

  it('end of sentence punctuation', () => {
    expect.assertions(1);

    const endOfSentencePunctuation = [
      ...new Set(
        (generateText(freqMapDefault, { quantity: 20 }, false) as string[][][])
          .reduce((acc, paragraph) => acc.concat(paragraph))
          .map((sentence) => last(last(sentence).split('')))
      ),
    ].sort();

    expect(endOfSentencePunctuation).toStrictEqual(['!', '.', '?']);
  });

  it('mid of sentence punctuation', () => {
    expect.assertions(1);

    const midOfSentencePunctuation = [
      ...new Set(
        (generateText(freqMapDefault, { quantity: 40 }, false) as string[][][])
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

  it("non-enclosing mid punctuation isn't placed between stopwords or numbers", () => {
    expect.assertions(1);

    const containsNonEnclosingMidOfSentencePunctuation = (word: string) =>
      /[,;:]/.test(word);

    const wordsBetweenPunctuationAreNeitherStopwordsNorNumbers = (
      generateText(freqMapDefault, { quantity: 40 }, false) as string[][][]
    )
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

  it("enclosing mid punctuation isn't placed between stopwords", () => {
    expect.assertions(1);

    const wordsBetweenPunctuationAreNotStopwords = (
      generateText(freqMapDefault, { quantity: 30 }, false) as string[][][]
    )
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

describe('`generateText` returns correct word placement', () => {
  const textArray = generateText(
    freqMapDefault,
    { quantity: 25 },
    false
  ) as string[][][];

  it("there're no more than 2 subsequent stopwords", () => {
    expect.assertions(1);

    const noMoreThan2SubsequentStopwords = textArray.every((paragraph) =>
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

    const noMoreThan3SubsequentNonStopwords = textArray.every((paragraph) =>
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

    const noDuplicateWords = textArray.every((paragraph) =>
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

    const sentencesNeitherStartNorEndWithNumbers = textArray.every(
      (paragraph) =>
        paragraph.every(
          (sentence) => !isNumeric(sentence[0]) && !isNumeric(last(sentence))
        )
    );

    expect(sentencesNeitherStartNorEndWithNumbers).toBe(true);
  });

  it("sentences doesn't have more than one number", () => {
    expect.assertions(1);

    const noMoreThan1NumberPerSentence = textArray.every((paragraph) =>
      paragraph.every(
        (sentence) => sentence.filter((word) => isNumeric(word)).length <= 1
      )
    );

    expect(noMoreThan1NumberPerSentence).toBe(true);
  });
});
