import preserveRemoveOrReplaceDotBase from '.';

const preserveRemoveOrReplaceDot = (text: string) =>
  preserveRemoveOrReplaceDotBase(text, true);

describe('preserveRemoveOrReplaceDot', () => {
  it('preserve dot if numeric value', () => {
    expect.assertions(2);

    const a = preserveRemoveOrReplaceDot('1.000.000');
    expect(a).toBe('1.000.000');

    // if there's trailing dot, remove it
    const b = preserveRemoveOrReplaceDot('1.000.000.');
    expect(b).toBe('1.000.000');
  });

  // preserve dot if word containing leading dot occurs more than once
  it('preserve or remove leading dot', () => {
    expect.assertions(3);

    const a = preserveRemoveOrReplaceDot('.foo');
    expect(a).toBe('foo');

    const b = preserveRemoveOrReplaceDot('.foo .foo');
    expect(b).toBe('.foo .foo');

    const c = preserveRemoveOrReplaceDot('.the');
    expect(c).toBe('');
  });

  // preserve dot if word containing trailing dot happens
  // more than once and more often than word without trailing dot
  it('preserve or remove trailing dot', () => {
    expect.assertions(5);

    const a = preserveRemoveOrReplaceDot('foo.');
    expect(a).toBe('foo');

    const b = preserveRemoveOrReplaceDot('foo. foo.');
    expect(b).toBe('foo. foo.');

    const c = preserveRemoveOrReplaceDot('foo. foo. foo');
    expect(c).toBe('foo. foo. foo');

    const d = preserveRemoveOrReplaceDot('foo. foo foo. foo');
    expect(d).toBe('foo foo foo foo');

    const e = preserveRemoveOrReplaceDot('the. the.');
    expect(e).toBe(' ');
  });

  it('replace dot in `/[a-z0-9].[A-Z0-9]/`', () => {
    expect.assertions(6);

    const a = preserveRemoveOrReplaceDot('13.Foo');
    expect(a).toBe('13 Foo');

    const b = preserveRemoveOrReplaceDot('foo.13');
    expect(b).toBe('foo 13');

    const c = preserveRemoveOrReplaceDot('foo.Bar');
    expect(c).toBe('foo Bar');

    const d = preserveRemoveOrReplaceDot('the.Foo');
    expect(d).toBe('Foo');

    const e = preserveRemoveOrReplaceDot('foo.The');
    expect(e).toBe('foo');

    const f = preserveRemoveOrReplaceDot('and.The');
    expect(f).toBe('');
  });

  it('preserve dot in anything else', () => {
    expect.assertions(2);

    // words with multiple dots
    const a = preserveRemoveOrReplaceDot('F.O.O. f.o.o. google.com.br .foo.');
    expect(a).toBe('F.O.O. f.o.o. google.com.br .foo.');

    // words with dot in the middle that aren't matched previously
    const b = preserveRemoveOrReplaceDot('google.com A.B A.b');
    expect(b).toBe('google.com A.B A.b');
  });
});
