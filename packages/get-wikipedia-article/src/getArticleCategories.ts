import { wikipediaLanguageType as languageType } from 'fullfiller-common/src/types';

import { fetchResource } from './common/utils';

type response = {
  categories: [{ title: string }];
};

/**
 * Fetch all Wikipedia categories the given article belongs to.
 * @param title Wikipedia article title.
 * @returns Array of Wikipedia categories names.
 */
async function getArticleCategories(
  language: languageType,
  title: string
): Promise<string[]> {
  const queries = {
    action: 'query',
    prop: 'categories',
    redirects: undefined,
    cllimit: 'max',
    clshow: '!hidden',
    titles: encodeURIComponent(title),
  };

  // There's no reason to use a recursive function like in getArticleLinks,
  // even the articles containing the most categories don't have more than 500 categories
  // (https://en.wikipedia.org/wiki/Special:MostCategories);
  // request below will fetch at most 500 normal (not hidden) categories

  const resp = (await fetchResource(language, queries)) as unknown as response;

  const categories = resp.categories.map((obj) =>
    obj.title.replace(/^Category:/, '')
  );

  return categories;
}

export default getArticleCategories;
