import { invalidUnit } from 'fullfiller-common/src/errorMessages';
import { unitType } from 'fullfiller-common/src/types';

function validateUnit(unit: unitType): string[] {
  const errors: string[] = [];

  if (unit !== 'words' && unit !== 'paragraphs') {
    errors.push(invalidUnit);
  }

  return errors;
}

export default validateUnit;
