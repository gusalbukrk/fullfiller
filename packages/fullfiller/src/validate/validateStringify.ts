import { invalidStringify } from 'fullfiller-common/src/errorMessages';

function validateStringify(stringify: boolean): string[] {
  const errors: string[] = [];

  if (typeof stringify !== 'boolean') {
    errors.push(invalidStringify);
  }

  return errors;
}

export default validateStringify;
