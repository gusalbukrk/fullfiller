import { formatType } from 'fullfiller-common/src/types';

/**
 * Summary is the initial chunk of text, everything before the first subtitle.
 * It's possible to get it with API `&action=query&prop=extracts&exintro`.
 * But the entire article was fetched already, so there's no need to make another API call.
 *
 * @summary Extract summary from article body.
 * @param body Wikipedia article body.
 * @param format Article format.
 * @returns Wikipedia article summary.
 */
function extractSummaryFromBody(
  body: string,
  format: formatType
): string | undefined {
  const plaintextRE = /^[\s\S]*?(?=\n\n\n==)/;
  const htmlRE = /^[\s\S]*?(?=\n\n<h2>)/;
  const RE = format === 'plain' ? plaintextRE : htmlRE;

  const summary = RE.exec(body)?.[0];

  return summary;
}

export default extractSummaryFromBody;
