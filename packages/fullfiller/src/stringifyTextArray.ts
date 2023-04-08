import { formatType } from 'fullfiller-common/src/types';

const stringifyParagraph = (paragraph: string[][]) =>
  paragraph.map((sentence) => sentence.join(' ')).join(' ');

function stringifyTextArray(
  textArray: string[][][],
  format: formatType
): string {
  const text = textArray
    .map((paragraph) =>
      format === 'plain'
        ? stringifyParagraph(paragraph)
        : `<p>${stringifyParagraph(paragraph)}</p>`
    )
    .join(format === 'plain' ? '\n' : '');

  return text;
}

export default stringifyTextArray;
