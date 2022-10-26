import { invalidFormat } from 'fullfiller-common/src/errorMessages';
import { formatType } from 'fullfiller-common/src/types';

function validateFormat(format: formatType): string[] {
  const errors: string[] = [];

  if (!(format === 'plain' || format === 'html')) {
    errors.push(invalidFormat);
  }

  return errors;
}

export default validateFormat;
