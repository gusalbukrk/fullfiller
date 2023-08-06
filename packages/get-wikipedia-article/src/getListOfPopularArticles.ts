import { wikipediaLanguageType as languageType } from 'fullfiller-common/src/types';

/** @example n = 0 for today, n = 1 for yesterday, ... */
function getDateMinusNDays(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

/** used for padding days and months */
function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/** recursively hit the API until the most recent day with data is found */
async function fetchAPI(
  language: languageType,
  minusNDays = 1,
): Promise<{ items: [{ articles: { article: string }[] }] }> {
  const date = getDateMinusNDays(minusNDays);

  // not using `generateRequestURL` because API's base URL is different
  // gets top 1000 articles — there's no API option to limit the quantity of results
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${language}.wikipedia/all-access/${date.getUTCFullYear()}/${pad(
    date.getUTCMonth() + 1,
  )}/${pad(date.getUTCDate())}`;

  const resp = (await (await fetch(url)).json()) as {
    items: [{ articles: { article: string }[] }];
  };

  return resp.items === undefined ? fetchAPI(language, minusNDays + 1) : resp;
}

/** @returns Array of titles of popular articles. */
async function getListOfPopularArticles(
  language: languageType,
  limit = 100,
): Promise<string[]> {
  // start by trying to fetch data from yesterday because
  // data only starts to get loaded after the day ends (UTC) and loading usually takes a few hours
  // https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews#Updates_and_backfilling
  const resp = await fetchAPI(language);

  const titles = resp.items[0].articles.map((a) => a.article);

  // slice returns the whole array if end >= array.length
  return titles.slice(0, limit);
}

export default getListOfPopularArticles;
