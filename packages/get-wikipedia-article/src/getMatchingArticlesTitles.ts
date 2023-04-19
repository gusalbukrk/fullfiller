import CustomError from 'fullfiller-common/src/CustomError';
import { articleNotFound } from 'fullfiller-common/src/errorMessages';
import { languagesType } from 'fullfiller-common/src/types';

import { generateRequestURL } from './common/utils';

/**
 * Fetch Wikipedia article(s) title(s) that match query.
 * @param query Search string.
 * @param single Fetch only a single result.
 * @throws Error if no results were found.
 * @returns Array of title(s).
 */
async function getMatchingArticlesTitles(
  query: string,
  language: languagesType,
  single = false
): Promise<string[]> {
  const requestURL = generateRequestURL(language, {
    action: 'opensearch',
    limit: single ? 1 : 'max',

    // `redirects=resolve` is required otherwise response may contain the name of a redirect
    // instead of the target page; page and redirect have slight different titles
    // e.g. query `lord of the rings` would return `Lord of the rings`
    // which is the redirect for `The Lord of the Rings`
    redirects: 'resolve',

    search: encodeURIComponent(query),
  });

  const resp = await fetch(requestURL);
  const json = (await resp.json()) as string[][];
  const titles = json[1];

  if (titles.length === 0)
    throw new CustomError(articleNotFound, 'get-wikipedia-article');

  return titles;
}

export default getMatchingArticlesTitles;
