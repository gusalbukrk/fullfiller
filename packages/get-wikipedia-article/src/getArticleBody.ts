import { formatType, languagesType } from 'fullfiller-common/src/types';

import { fetchResource } from './common/utils';

type response = {
  extract: string;
};

/**
 * Fetch Wikipedia article body.
 * @param title Wikipedia article title.
 * @param format Which one of the 2 formats available in the Wikipedia API.
 * @param related Wikipedia related articles titles (to recommend in case of error).
 * @returns Wikipedia article body.
 */
async function getArticleBody(
  language: languagesType,
  title: string,
  format: formatType
): Promise<string> {
  const queries = {
    action: 'query',
    prop: 'extracts',
    ...(format === 'plain' && { explaintext: undefined }),
    redirects: undefined,
    titles: encodeURIComponent(title),
  };

  const resp = (await fetchResource(language, queries)) as unknown as response;

  const body = resp.extract;

  return body;
}

export default getArticleBody;
