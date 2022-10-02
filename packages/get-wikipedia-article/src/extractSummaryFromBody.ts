import { optionsType } from 'xlorem-common/src/types';

/**
 * Summary is the initial chunk of text, everything before the first subtitle.
 * It's possible to get it with API `&action=query&prop=extracts&exintro`.
 * But the entire article was fetched already, so there's no need to make another API call.
 *
 * @summary Extract summary from article body.
 * @param body Wikipedia article body.
 * @param bodyFormat Article format.
 * @returns Wikipedia article summary.
 */
function extractSummaryFromBody(
  body: string,
  bodyFormat: optionsType['bodyFormat']
): string | undefined {
  const plaintextRE = /^[\s\S]*?(?=\n\n\n==)/;
  const htmlRE = /^[\s\S]*?(?=\n\n<h2>)/;
  const RE = bodyFormat === 'plain' ? plaintextRE : htmlRE;

  const summary = RE.exec(body)?.[0];

  return summary;
}

export default extractSummaryFromBody;
