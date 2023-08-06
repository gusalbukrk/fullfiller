import CustomError from 'fullfiller-common/src/CustomError';
import { wikipediaLanguages } from 'fullfiller-common/src/constants';
import {
  articleIsDisambiguation,
  invalidLanguage,
} from 'fullfiller-common/src/errorMessages';
import {
  articleType,
  formatType,
  termsType,
  wikipediaLanguageType as languageType,
} from 'fullfiller-common/src/types';
import { getRandomArrayElement } from 'fullfiller-common/src/utils';

import { includeType } from './common/types';
import extractSummaryFromBody from './extractSummaryFromBody';
import getArticleBody from './getArticleBody';
import getArticleCategories from './getArticleCategories';
import getArticleLinks from './getArticleLinks';
import getArticleSummary from './getArticleSummary';
import getArticleTerms from './getArticleTerms';
import getListOfPopularArticles from './getListOfPopularArticles';
import getListOfRandomArticles from './getListOfRandomArticles';
import getMatchingArticlesTitles from './getMatchingArticlesTitles';
import queryPointsToADisambiguationPage from './queryPointsToADisambiguationPage';

type optionsType = Partial<{
  language: languageType;
  include: includeType;
  format: formatType;
}>;

const includeDefault: includeType = ['title', 'body'];

/**
 * Fetch Wikipedia article's resources (e.g. title, body, links...).
 * @param query Search string.
 * @param options Miscellaneous options.
 * @throws Error if `query` doesn't return any results.
 * @throws Error if `article.title` points to a disambiguation page.
 * @returns Object containing requested resources.
 */
async function getWikipediaArticle(
  query: string,
  {
    language = 'en',
    include = includeDefault,
    format = 'plain',
  }: optionsType = {},
): Promise<articleType> {
  if (!Object.keys(wikipediaLanguages).includes(language)) {
    throw new CustomError(
      invalidLanguage(language, Object.keys(wikipediaLanguages)),
      'get-wikipedia-article',
    );
  }

  if ([':popular', ':random'].includes(query)) {
    return getWikipediaArticle(
      query === ':popular'
        ? getRandomArrayElement(await getListOfPopularArticles(language))
        : (await getListOfRandomArticles(language, 1))[0],
      {
        language,
        include,
        format,
      },
    );
  }

  if (include.length === 0) include.push(...includeDefault);

  const article: articleType = {};

  // fetch title, related
  if (include.includes('title') && include.includes('related')) {
    // first result will be selected as the article to be fetched
    const [title, ...related] = await getMatchingArticlesTitles(
      language,
      query,
    );
    article.title = title;
    article.related = related;
  } else if (include.includes('title')) {
    const [title] = await getMatchingArticlesTitles(language, query);
    article.title = title;
  } else if (include.includes('related')) {
    const [, ...related] = await getMatchingArticlesTitles(language, query);
    article.related = related;
  }

  // API calls to `action=query` using `query` instead of `article.title`
  // are allowed because `redirects` parameter is being used
  const titleQuery = article.title || query;

  // the only option other than to make a separate request at main function checking if page is
  // disambiguation, would be to check if page is disambiguation at every resource request
  if (await queryPointsToADisambiguationPage(language, titleQuery)) {
    throw new CustomError(
      articleIsDisambiguation(article.related || [] /* suggestions */),
      'get-wikipedia-article',
    );
  }

  // fetch body
  if (include.includes('body')) {
    article.body = await getArticleBody(language, titleQuery, format);
  }

  // fetch summary
  if (include.includes('summary')) {
    article.summary = article.body
      ? extractSummaryFromBody(article.body, format)
      : await getArticleSummary(language, titleQuery, format);
  }

  // fetch categories
  if (include.includes('categories')) {
    article.categories = await getArticleCategories(language, titleQuery);
  }

  // fetch links
  if (include.includes('links')) {
    article.links = await getArticleLinks(language, titleQuery);
  }

  // fetch terms
  const termsToInclude = (
    ['alias', 'label', 'description'] as (keyof termsType)[]
  ).filter((term) => include.includes(term));

  if (termsToInclude.length > 0) {
    const terms = await getArticleTerms(language, titleQuery, termsToInclude);

    (Object.keys(terms) as (keyof termsType)[]).forEach((term) => {
      article[term] = terms[term];
    });
  }

  return article;
}

export default getWikipediaArticle;
