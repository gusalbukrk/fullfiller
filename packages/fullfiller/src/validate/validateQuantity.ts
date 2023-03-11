import {
  quantityNotNumber,
  quantityTooSmall,
} from 'fullfiller-common/src/errorMessages';
import {
  unitType,
  sentencesPerParagraphType,
  wordsPerSentenceType,
} from 'fullfiller-common/src/types';

function getType(value: unknown) {
  return Array.isArray(value) ? 'array' : typeof value;
}

function validateQuantity(
  quantity: number,
  unit: unitType,
  sentencesPerParagraph: sentencesPerParagraphType,
  wordsPerSentence: wordsPerSentenceType
): string[] {
  const errors: string[] = [];

  const type = getType(quantity);

  if (type !== 'number' || Number.isNaN(quantity)) {
    errors.push(quantityNotNumber);
  }

  // if (type === 'number' && (unit === 'words' || unit === 'paragraphs')) {
  //   const wordsPerParagraphMin =
  //     sentencesPerParagraphDefault.min * wordsPerSentenceDefault.min;
  //   const minimumQuantityAllowed = unit === 'words' ? wordsPerParagraphMin : 1;

  //   if (quantity < minimumQuantityAllowed) {
  //     errors.push(quantityTooSmall(minimumQuantityAllowed));

  if (type === 'number' && (unit === 'words' || unit === 'paragraphs')) {
    const minimumQuantityAllowed =
      unit === 'words' ? sentencesPerParagraph.min * wordsPerSentence.min : 1;

    if (quantity < minimumQuantityAllowed) {
      errors.push(quantityTooSmall(minimumQuantityAllowed));
    }
  }

  return errors;
}

export default validateQuantity;
