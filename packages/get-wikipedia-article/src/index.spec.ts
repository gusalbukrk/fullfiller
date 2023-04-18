import 'cross-fetch/polyfill';

import {
  articleNotFound,
  articleIsDisambiguation,
} from 'fullfiller-common/src/errorMessages';
import { includeType } from 'fullfiller-common/src/types';

import getWikipediaArticleBase from '.';

// NOTE: having many api calls in tests will make the api trigger `429 Too many requests` error
// in the console, the error will show up as:
// `FetchError: invalid json response body at ... reason: Unexpected token < in JSON at position 0`
// Fix: every time the main function is called, delay its execution a bit
async function getWikipediaArticle(
  ...args: Parameters<typeof getWikipediaArticleBase>
): ReturnType<typeof getWikipediaArticleBase> {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return getWikipediaArticleBase(...args);
}

const isArrayOfStrings = (arg: unknown) =>
  Array.isArray(arg) && arg.every((el) => typeof el === 'string');

jest.setTimeout(10000);

describe('main function returns correctly', () => {
  it('request all resources', async () => {
    expect.assertions(10);

    const include = [
      'title',
      'body',
      'related',
      'summary',
      'categories',
      'links',
      'description',
      'alias',
      'label',
    ].sort() as includeType;

    const article = await getWikipediaArticle('harry potter', { include });

    expect(Object.keys(article).sort()).toStrictEqual(include);

    expect(article.title).toBe('Harry Potter');
    expect(typeof article.body).toBe('string');
    expect(typeof article.summary).toBe('string');
    expect(isArrayOfStrings(article.related)).toBe(true);
    expect(isArrayOfStrings(article.categories)).toBe(true);
    expect(isArrayOfStrings(article.links)).toBe(true);
    expect(isArrayOfStrings(article.description)).toBe(true);
    expect(isArrayOfStrings(article.label)).toBe(true);
    expect(isArrayOfStrings(article.alias)).toBe(true);
  }, 20000);

  // when requesting `summary`,
  // `getArticleSummary` will only be used when `body` isn't requested
  // (because when `body` is requested, `extractSummaryFromBody` will be used instead)
  it('request summary, but not body (that is, use `getArticleSummary`)', async () => {
    expect.assertions(3);

    const article = await getWikipediaArticle('harry potter', {
      include: ['summary'],
    });

    expect(Object.keys(article)).toStrictEqual(['summary']);
    expect(typeof article.summary).toBe('string');
    expect(article.summary).not.toHaveLength(0);
  });
});

describe('main function throws errors correctly', () => {
  it('articleNotFound', async () => {
    expect.assertions(1);

    await expect(getWikipediaArticle('xxyyzz')).rejects.toThrow(
      articleNotFound
    );
  });

  it('articleIsDisambiguation', async () => {
    expect.assertions(2);

    const query = '(disambiguation)'; // this query points to a disambiguation page

    // when there're no suggestions
    await expect(getWikipediaArticle(query)).rejects.toThrow(
      articleIsDisambiguation([])
    );

    // when there're suggestions
    await expect(
      getWikipediaArticle(query, { include: ['related'] })
    ).rejects.toThrow(
      new RegExp(`^${articleIsDisambiguation([]).split(/(?<=\.)\s/)[0]}`)
    );
  });
});
