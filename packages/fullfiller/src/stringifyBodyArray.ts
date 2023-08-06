import { formatType, fillerBodyArrayType } from 'fullfiller-common/src/types';

const stringifyParagraph = (paragraph: string[][]) =>
  paragraph.map((sentence) => sentence.join(' ')).join(' ');

function stringifyBodyArray(
  bodyArray: fillerBodyArrayType,
  format: formatType,
): string {
  const body = bodyArray
    .map((paragraph) =>
      format === 'plain'
        ? stringifyParagraph(paragraph)
        : `<p>${stringifyParagraph(paragraph)}</p>`,
    )
    .join(format === 'plain' ? '\n' : '');

  return body;
}

export default stringifyBodyArray;
