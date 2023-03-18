import CustomError from 'fullfiller-common/src/CustomError';
import { articleIsDisambiguation } from 'fullfiller-common/src/errorMessages';
import {
  articleType,
  includeType,
  formatType,
  termsType,
} from 'fullfiller-common/src/types';

import extractSummaryFromBody from './extractSummaryFromBody';
import getArticleBody from './getArticleBody';
import getArticleCategories from './getArticleCategories';
import getArticleLinks from './getArticleLinks';
import getArticleSummary from './getArticleSummary';
import getArticleTerms from './getArticleTerms';
import getMatchingArticlesTitles from './getMatchingArticlesTitles';
import queryPointsToADisambiguationPage from './queryPointsToADisambiguationPage';

const includeDefault: includeType = ['title', 'body'];

/**
 * Fetch Wikipedia article's resources (e.g. title, body, links...).
 * @param query Search string.
 * @param include Which resources to include in the return object.
 * @param options
 * @throws Error if `query` doesn't return any results.
 * @throws Error if `article.title` points to a disambiguation page.
 * @returns Object containing requested resources.
 */
async function getWikipediaArticle(
  query: string,
  include: includeType = includeDefault,
  { format = 'plain' }: Partial<{ format: formatType }> = {}
): Promise<articleType> {
  if (include.length === 0) include.push(...includeDefault);

  const article: articleType = {};

  // fetch title, related
  if (include.includes('title') && include.includes('related')) {
    // first result will be selected as the article to be fetched
    const [title, ...related] = await getMatchingArticlesTitles(query);
    article.title = title;
    article.related = related;
  } else if (include.includes('title')) {
    const [title] = await getMatchingArticlesTitles(query);
    article.title = title;
  } else if (include.includes('related')) {
    const [, ...related] = await getMatchingArticlesTitles(query);
    article.related = related;
  }

  // API calls to `action=query` using `query` instead of `article.title`
  // are allowed because `redirects` parameter is being used
  const titleQuery = article.title || query;

  // the only option other than to make a separate request at main function checking if page is
  // disambiguation, would be to check if page is disambiguation at every resource request
  if (await queryPointsToADisambiguationPage(titleQuery)) {
    throw new CustomError(
      articleIsDisambiguation(article.related || [] /* suggestions */),
      'get-wikipedia-article'
    );
  }

  // fetch body
  if (include.includes('body')) {
    article.body = await getArticleBody(titleQuery, format);
  }

  // fetch summary
  if (include.includes('summary')) {
    article.summary = article.body
      ? extractSummaryFromBody(article.body, format)
      : await getArticleSummary(titleQuery, format);
  }

  // fetch categories
  if (include.includes('categories')) {
    article.categories = await getArticleCategories(titleQuery);
  }

  // fetch links
  if (include.includes('links')) {
    article.links = await getArticleLinks(titleQuery);
  }

  // fetch terms
  const termsToInclude = (
    ['alias', 'label', 'description'] as (keyof termsType)[]
  ).filter((term) => include.includes(term));

  if (termsToInclude.length > 0) {
    const terms = await getArticleTerms(titleQuery, termsToInclude);

    (Object.keys(terms) as (keyof termsType)[]).forEach((term) => {
      article[term] = terms[term];
    });
  }

  return article;
}

export default getWikipediaArticle;
