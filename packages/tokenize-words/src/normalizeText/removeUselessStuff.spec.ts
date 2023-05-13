import removeUselessStuff from './removeUselessStuff';

// trim and collapse whitespace
const trim = (str: string, replaceBy = ' ') =>
  str.trim().replace(/\s+/g, replaceBy);

describe('removeUselessStuff', () => {
  it('remove most punctuations', () => {
    expect.assertions(1);

    const punctuations = `'"()[]{}<>-–—,;:?!…`; // contains all 15 english punctuations except dot

    const preserved = removeUselessStuff(punctuations).replace(/\s+/g, '');

    expect(preserved).toBe("'-");
  });

  it("preserve commas & colons only when they're surrounded by numbers", () => {
    expect.assertions(2);

    const a = trim(removeUselessStuff(':81 x:y 7:1 Foo:Bar 13:20 foo:bar 5:'));
    expect(a).toBe('81 x y 7:1 Foo Bar 13:20 foo bar 5');

    const b = trim(removeUselessStuff(',31 x,y 7,1 Foo,Bar 13,20 foo,bar 9,'));
    expect(b).toBe('31 x y 7,1 Foo Bar 13,20 foo bar 9');
  });

  it('remove multiple dots and ellipse char', () => {
    expect.assertions(1);

    const a = trim(removeUselessStuff('foo... bar… ..baz'));
    expect(a).toBe('foo bar baz');
  });

  it('remove newlines', () => {
    expect.assertions(1);

    const a = trim(removeUselessStuff('\n \n\n'));
    expect(a).toBe('');
  });

  it('remove space between initials', () => {
    expect.assertions(1);

    const a = trim(removeUselessStuff('J. K.  J. R. R.'));
    expect(a).toBe('J.K. J.R.R.');
  });
});
