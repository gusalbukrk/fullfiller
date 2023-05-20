import { wikipediaLanguageType as languageType } from 'fullfiller-common/src/types';

/** @returns Array of titles of popular articles. */
async function getListOfPopularArticles(
  language: languageType,
  limit = 100
): Promise<string[]> {
  // fetching data from the day before yesterday because
  // data only starts to get loaded after the day ends and loading usually takes a few hours
  // https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews#Updates_and_backfilling
  const dby = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  // not using `generateRequestURL` because API's base URL is different
  // gets top 1000 articles — there's no API option to limit the quantity of results
  const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/${language}.wikipedia/all-access/${dby.getFullYear()}/${(
    dby.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}/${dby.getDate()}`;

  const resp = (await (await fetch(url)).json()) as {
    items: [{ articles: { article: string }[] }];
  };

  const titles = resp.items[0].articles.map((a) => a.article);

  // slice returns the whole array if end >= array.length
  return titles.slice(0, limit);
}

export default getListOfPopularArticles;
