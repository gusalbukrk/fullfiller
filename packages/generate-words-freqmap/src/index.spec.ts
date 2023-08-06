import tokenizeWords from 'tokenize-words/src';

import generateFreqMap from '.';

describe('generateFreqMap returns correctly', () => {
  const wordsArray = tokenizeWords(`
    ${'foo '.repeat(3)}
    bar
    ${'baz '.repeat(3)}
    ${'foobar '.repeat(10)}
    ${'qux '.repeat(15)}
  `);

  it('`wordsArray` (first argument)', () => {
    expect.assertions(1);

    const a = generateFreqMap(wordsArray);
    expect(a).toStrictEqual({
      1: ['bar'],
      3: ['foo', 'baz'],
      10: ['foobar'],
      15: ['qux'],
    });
  });

  it('`wordsToEmphasize` (second argument)', () => {
    expect.assertions(1);

    const a = generateFreqMap(wordsArray, ['foo', 'bar']);
    expect(a).toStrictEqual({
      2: ['bar'],
      3: ['baz'],
      6: ['foo'],
      10: ['foobar'],
      15: ['qux'],
    });
  });

  it('`options` (third argument)', () => {
    expect.assertions(5);

    const a = generateFreqMap(wordsArray, ['baz'], { emphasizeBy: 2.5 });
    expect(a).toStrictEqual({
      1: ['bar'],
      3: ['foo'],
      8: ['baz'],
      10: ['foobar'],
      15: ['qux'],
    });

    const b = generateFreqMap(wordsArray, [], { tierWeightMin: 5 });
    expect(b).toStrictEqual({
      10: ['foobar'],
      15: ['qux'],
    });

    const c = generateFreqMap(wordsArray, [], { tierWeightMax: 5 });
    expect(c).toStrictEqual({
      1: ['bar'],
      3: ['foo', 'baz'],
    });

    const d = generateFreqMap(wordsArray, [], { mergePosteriorTiersAt: 3 });
    expect(d).toStrictEqual({
      1: ['bar'],
      3: ['foo', 'baz', 'foobar', 'qux'],
    });

    const e = generateFreqMap(wordsArray, ['foo'], {
      emphasizeBy: 2,
      tierWeightMin: 2,
      tierWeightMax: 10,
      mergePosteriorTiersAt: 6,
    });

    expect(e).toStrictEqual({
      3: ['baz'],
      6: ['foo', 'foobar'],
    });
  });

  it("correctly handles words that are `Object.prototype`'s properties", () => {
    expect.assertions(1);

    const a = generateFreqMap(['constructor', 'toString', 'constructor']);
    expect(a).toStrictEqual({ 1: ['toString'], 2: ['constructor'] });
  });
});

describe('generateFreqMap throws errors correctly', () => {
  it('`notEnoughWordsInFreqMap` error', () => {
    expect.assertions(1);

    expect(() => generateFreqMap([], [], { wordsQuantityMin: 1 })).toThrow(
      "Given `wordsArray` doesn't have enough words to construct `freqMap` containing the minimum quantity of words required.",
    );
  });
});
