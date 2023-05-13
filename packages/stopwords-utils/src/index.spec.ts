import { isStopword, generateGetRandomStopwordFn } from './index';

describe('isStopword', () => {
  it('case insensitive', () => {
    expect.assertions(3);

    expect(isStopword('the')).toBe(true);
    expect(isStopword('The')).toBe(true);
    expect(isStopword('THE')).toBe(true);
  });

  it(`single letter isn't stopword, except 'a' & 'i'`, () => {
    expect.assertions(4);

    expect(isStopword('a')).toBe(true);
    expect(isStopword('i')).toBe(true);
    expect(isStopword('t')).toBe(false);
    expect(isStopword('e')).toBe(false);
  });
});

describe('generateGetRandomStopwordFn', () => {
  it('returns `() => string`', () => {
    expect.assertions(2);

    const getRandomStopword = generateGetRandomStopwordFn();
    const sw = getRandomStopword();

    expect(typeof getRandomStopword).toBe('function');
    expect(typeof sw).toBe('string');
  });
});
