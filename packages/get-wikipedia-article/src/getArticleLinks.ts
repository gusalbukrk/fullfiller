import { queriesType } from 'fullfiller-common/src/types';

import { fetchResource } from './common/utils';

type response = {
  links: { title: string }[];
  plcontinue: string;
};

async function getLinksRecursively(queries: queriesType): Promise<string[]> {
  const resp = (await fetchResource(queries)) as unknown as response;

  const links = resp.links.map((obj) => obj.title);

  return !('plcontinue' in resp)
    ? links
    : links.concat(
        await getLinksRecursively({
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
async function getArticleLinks(title: string): Promise<string[]> {
  const queries = {
    action: 'query',
    prop: 'links',
    redirects: undefined,
    pllimit: 'max',
    plnamespace: '0',
    titles: encodeURIComponent(title),
  };

  const links = await getLinksRecursively(queries);

  return links;
}

export default getArticleLinks;
