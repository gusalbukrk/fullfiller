import { wikipediaLanguageType as languageType } from 'fullfiller-common/src/types';

import { generateRequestURL } from './common/utils';

/** @returns Array of titles of random articles. */
async function getListOfRandomArticles(
  language: languageType,
  limit = 10,
): Promise<string[]> {
  const queries = {
    action: 'query',
    list: 'random',
    rnnamespace: 0,
    rnlimit: limit,
  };

  const url = generateRequestURL(language, queries);
  const resp = (await (await fetch(url)).json()) as {
    query: { random: { id: number; title: 'string' }[] };
  };

  const titles = resp.query.random.map((obj) => obj.title);

  return titles;
}

export default getListOfRandomArticles;
