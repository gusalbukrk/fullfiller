import {
  sentencesPerParagraphDefault,
  wordsPerSentenceDefault,
} from 'fullfiller-common/src/constants';
import * as errorMessages from 'fullfiller-common/src/errorMessages';

import validateFormat from './validateFormat';
import validateInput from './validateInput';
import validateQuantity from './validateQuantity';
import validateSentencesPerParagraph from './validateSentencesPerParagraph';
import validateUnit from './validateUnit';
import validateWordsPerSentence from './validateWordsPerSentence';

describe('throw error messages correctly', () => {
  it('input argument', () => {
    expect.assertions(4);

    // @ts-expect-error: test
    const w = validateInput(true)[0];

    // @ts-expect-error: test
    const x = validateInput(() => null)[0];

    const y = validateInput('')[0];
    const z = validateInput({ title: 'test', body: '' })[0];

    expect(w).toBe(errorMessages.invalidInput);
    expect(x).toBe(errorMessages.invalidInput);
    expect(y).toBe(errorMessages.emptyQueryString);
    expect(z).toBe(errorMessages.textTooShort);
  });

  it('unit argument', () => {
    expect.assertions(2);

    // @ts-expect-error: test
    const x = validateUnit('')[0];
    // @ts-expect-error: test
    const y = validateUnit('abcde')[0];

    expect(x).toBe(errorMessages.invalidUnit);
    expect(y).toBe(errorMessages.invalidUnit);
  });

  it('quantity argument', () => {
    expect.assertions(2);

    const x = validateQuantity(
      // @ts-expect-error: test
      '...',
      'paragraphs',
      sentencesPerParagraphDefault,
      wordsPerSentenceDefault,
    )[0];
    const y = validateQuantity(
      0,
      'paragraphs',
      sentencesPerParagraphDefault,
      wordsPerSentenceDefault,
    )[0];

    expect(x).toBe(errorMessages.quantityNotNumber);
    expect(y).toBe(errorMessages.quantityTooSmall(1));
  });

  it('format argument', () => {
    expect.assertions(2);

    // @ts-expect-error: test
    const x = validateFormat('')[0];
    // @ts-expect-error: test
    const y = validateFormat('abcde')[0];

    expect(x).toBe(errorMessages.invalidFormat);
    expect(y).toBe(errorMessages.invalidFormat);
  });

  it('`sentencesPerParagraph` & `wordsPerSentence` arguments', () => {
    expect.assertions(8);

    // @ts-expect-error: test
    const s = validateSentencesPerParagraph({})[0];
    //
    const t = validateSentencesPerParagraph({
      min: 2,
      max: 5,
    })[0];
    //
    const u = validateSentencesPerParagraph({
      min: 3,
      max: 2,
    })[0];
    //
    const v = validateSentencesPerParagraph({
      min: 5,
      max: 8,
    })[0];

    // @ts-expect-error: test
    const w = validateWordsPerSentence({})[0];
    //
    const x = validateWordsPerSentence({
      min: 2,
      max: 5,
    })[0];
    //
    const y = validateWordsPerSentence({
      min: 3,
      max: 2,
    })[0];
    //
    const z = validateWordsPerSentence({
      min: 8,
      max: 12,
    })[0];

    expect(s).toBe(errorMessages.invalidSentencesPerParagraph);
    expect(t).toBe(errorMessages.sentencesPerParagraphMinTooSmall);
    expect(u).toBe(errorMessages.sentencesPerParagraphMaxTooSmall);
    expect(v).toBe(errorMessages.invalidSentencesPerParagraphMax);

    expect(w).toBe(errorMessages.invalidWordsPerSentence);
    expect(x).toBe(errorMessages.wordsPerSentenceMinTooSmall);
    expect(y).toBe(errorMessages.wordsPerSentenceMaxTooSmall);
    expect(z).toBe(errorMessages.invalidWordsPerSentenceMax);
  });
});
