import {
  queriesType,
  languagesTypeGWA as languagesType,
} from 'fullfiller-common/src/types';

import { fetchResource } from './common/utils';

type response = {
  links: { title: string }[];
  plcontinue: string;
};

async function getLinksRecursively(
  language: languagesType,
  queries: queriesType
): Promise<string[]> {
  const resp = (await fetchResource(language, queries)) as unknown as response;

  const links = resp.links.map((obj) => obj.title);

  return !('plcontinue' in resp)
    ? links
    : links.concat(
        await getLinksRecursively(language, {
          ...queries,
          plcontinue: encodeURIComponent(resp.plcontinue),
        })
      );
}

/**
 * Fetch all Wikipedia articles that are linked in the given article.
 * @param title Wikipedia article title.
 * @returns Array of Wikipedia articles titles.
 */
async function getArticleLinks(
  language: languagesType,
  title: string
): Promise<string[]> {
  const queries = {
    action: 'query',
    prop: 'links',
    redirects: undefined,
    pllimit: 'max',
    plnamespace: '0',
    titles: encodeURIComponent(title),
  };

  const links = await getLinksRecursively(language, queries);

  return links;
}

export default getArticleLinks;
