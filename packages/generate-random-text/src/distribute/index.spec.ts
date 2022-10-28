import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import { getRandomNumber } from 'fullfiller-common/src/utils';

import distribute from '.';

// TODO: fix duplication
// each `describe` block contains 2 duplicate tests and only 1 distinct

describe.each(Array.from({ length: 20 }).map(() => getRandomNumber(1, 25)))(
  "'paragraphs' unit",
  (quantity) => {
    const distribution = distribute(
      quantity,
      'paragraphs',
      sentencesPerParagraphDefault,
      wordsPerSentenceDefault
    );

    it('quantity', () => {
      expect.assertions(1);

      const paragraphsQuantity = distribution.length;
      expect(paragraphsQuantity).toStrictEqual(quantity);
    });

    it('quantity of sentences per paragraph conforms with given `sentencesPerParagraph`', () => {
      expect.assertions(2);

      const sentencesQuantityOfEachParagraph = distribution.reduce(
        (acc, cur) => [...acc, cur.length],
        []
      );

      const min = Math.min(...sentencesQuantityOfEachParagraph);
      const max = Math.max(...sentencesQuantityOfEachParagraph);

      expect(min).toBeGreaterThanOrEqual(sentencesPerParagraphDefault.min);

      expect(max).toBeLessThanOrEqual(sentencesPerParagraphDefault.max);
    });

    it('quantity of words per sentence conforms with given `wordsPerSentence`', () => {
      expect.assertions(2);

      const wordsQuantityOfEachSentence = distribution.reduce(
        (acc, cur) => [...acc, ...cur],
        []
      );

      const min = Math.min(...wordsQuantityOfEachSentence);
      const max = Math.max(...wordsQuantityOfEachSentence);

      expect(min).toBeGreaterThanOrEqual(wordsPerSentenceDefault.min);
      expect(max).toBeLessThanOrEqual(wordsPerSentenceDefault.max);
    });
  }
);

describe.each(
  Array.from({ length: 20 }).map(() =>
    getRandomNumber(
      wordsPerSentenceDefault.min * sentencesPerParagraphDefault.min,
      2000
    )
  )
)("'words' unit", (quantity) => {
  const distribution = distribute(
    quantity,
    'words',
    sentencesPerParagraphDefault,
    wordsPerSentenceDefault
  );

  it('quantity', () => {
    expect.assertions(1);

    const wordsQuantity = distribution
      .reduce((acc, cur) => [...acc, ...cur], [])
      .reduce((acc, cur) => acc + cur);

    expect(wordsQuantity).toStrictEqual(quantity);
  });

  it('quantity of sentences per paragraph conforms with given `sentencesPerParagraph`', () => {
    expect.assertions(2);

    const sentencesQuantityOfEachParagraph = distribution.reduce(
      (acc, cur) => [...acc, cur.length],
      []
    );

    const min = Math.min(...sentencesQuantityOfEachParagraph);
    const max = Math.max(...sentencesQuantityOfEachParagraph);

    expect(min).toBeGreaterThanOrEqual(sentencesPerParagraphDefault.min);

    expect(max).toBeLessThanOrEqual(sentencesPerParagraphDefault.max);
  });

  it('quantity of words per sentence conforms with given `wordsPerSentence`', () => {
    expect.assertions(2);

    const wordsQuantityOfEachSentence = distribution.reduce(
      (acc, cur) => [...acc, ...cur],
      []
    );

    const min = Math.min(...wordsQuantityOfEachSentence);
    const max = Math.max(...wordsQuantityOfEachSentence);

    expect(min).toBeGreaterThanOrEqual(wordsPerSentenceDefault.min);
    expect(max).toBeLessThanOrEqual(wordsPerSentenceDefault.max);
  });
});
