import CustomError from 'fullfiller-common/src/CustomError';
import {
  inputType,
  unitType,
  formatType,
  requirementsType,
} from 'fullfiller-common/src/types';

import validateFormat from './validateFormat';
import validateInput from './validateInput';
import validateQuantity from './validateQuantity';
import validateRequirements from './validateRequirements';
import validateUnit from './validateUnit';

function validate(
  input: inputType,
  unit: unitType,
  quantity: number,
  format: formatType,
  requirements: requirementsType
): void {
  const errors = ([] as string[]).concat(
    validateInput(input),
    validateUnit(unit),
    validateQuantity(quantity, unit),
    validateFormat(format),
    validateRequirements(requirements)
  );

  if (errors.length > 0)
    throw new CustomError(`[ ${errors.join(', ')} ]`, 'fullfiller');
}

export default validate;
