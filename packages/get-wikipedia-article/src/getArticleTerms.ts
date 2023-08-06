import {
  termsType,
  wikipediaLanguageType as languageType,
} from 'fullfiller-common/src/types';

import { fetchResource } from './common/utils';

type response = {
  terms: termsType;
};

/**
 * Fetch Wikipedia article terms.
 * @param title Wikipedia article title.
 * @param include Which terms to fetch (alias, description and/or label).
 * @returns Array of Wikipedia article terms.
 */
async function getArticleTerms(
  language: languageType,
  title: string,
  include: (keyof termsType)[],
): Promise<termsType> {
  const queries = {
    action: 'query',
    prop: 'pageterms',
    redirects: undefined,
    wbptlanguage: 'en',
    wbptterms: include.join('|'),
    titles: encodeURIComponent(title),
  };

  const resp = (await fetchResource(language, queries)) as unknown as response;

  const { terms } = resp;

  // if (include.length !== Object.keys(terms).length) {
  //   const print = (array: string[]) => array.sort().join(', ');

  //   console.warn(
  //     `Article lacks some of the terms requested. Requested: ${print(
  //       include
  //     )}. Fetched: ${print(Object.keys(terms))}.`
  //   );
  // }

  return terms;
}

export default getArticleTerms;
