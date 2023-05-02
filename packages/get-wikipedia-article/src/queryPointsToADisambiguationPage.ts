import { languagesTypeWikipedia as languagesType } from 'fullfiller-common/src/types';

import { fetchResource } from './common/utils';

type response = {
  pageprops?: {
    disambiguation: string;
  };
};

async function queryPointsToADisambiguationPage(
  language: languagesType,
  title: string
): Promise<boolean> {
  const queries = {
    action: 'query',
    prop: 'pageprops',
    ppprop: 'disambiguation',
    redirects: undefined,
    titles: encodeURIComponent(title),
  };

  const resp = (await fetchResource(language, queries)) as unknown as response;

  const pointsToDisambiguation = resp.pageprops?.disambiguation !== undefined;

  return pointsToDisambiguation;
}

export default queryPointsToADisambiguationPage;
