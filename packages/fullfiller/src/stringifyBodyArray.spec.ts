import stringifyBodyArray from './stringifyBodyArray';

describe('stringifyBodyArray', () => {
  const array = [[['foo'], ['bar', 'baz']], [['qux', 'quux']]];

  it("format: 'plain'", () => {
    expect.assertions(1);

    const text = stringifyBodyArray(array, 'plain');
    expect(text).toBe('foo bar baz\nqux quux');
  });

  it("format: 'html'", () => {
    expect.assertions(1);

    const text = stringifyBodyArray(array, 'html');
    expect(text).toBe('<p>foo bar baz</p><p>qux quux</p>');
  });
});
