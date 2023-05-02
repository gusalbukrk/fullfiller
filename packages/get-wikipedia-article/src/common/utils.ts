import {
  queriesType,
  languagesTypeWikipedia as languagesType,
} from 'fullfiller-common/src/types';

/**
 * Join Wikipedia API base URL and `queries`.
 * @param queries Object to be converted to query string.
 * @returns URL to make API call.
 */
export function generateRequestURL(
  language: languagesType,
  queries: queriesType
): string {
  const baseAPI = `https://${language}.wikipedia.org/w/api.php?&format=json&origin=*&`;

  const queryString = Object.entries(queries)
    .map(([key, value]) =>
      value === undefined ? key : `${key}=${value.toString()}`
    )
    .join('&');

  const requestURL = baseAPI + queryString;

  return requestURL;
}

type response = {
  query: {
    pages: {
      [key: string]: Record<string, unknown>;
    };
  };

  continue?: {
    [key: string]: string;
  };
};

/**
 * @summary Fetch response from Wikipedia API.
 * @param queries Object containing query string parameters.
 * @returns Object containing json.query.pages[pageID] and json.continue (if it exists) contents.
 */
export async function fetchResource(
  language: languagesType,
  queries: queriesType
): Promise<Record<string, unknown>> {
  const url = generateRequestURL(language, queries);

  const json = (await (await fetch(url)).json()) as response;

  // API's response isn't returned in its entirety by this function.
  // That's because the main part of the response is nested 3 layers deep.
  // As shown in the `response` interface.
  const { pages } = json.query;
  const pagesID = Object.keys(pages)[0];

  const resp = {
    ...pages[pagesID],

    // some resources responses (e.g. links) include `continue` when there's more to fetch
    ...(json.continue && json.continue),
  };

  return resp;
}
