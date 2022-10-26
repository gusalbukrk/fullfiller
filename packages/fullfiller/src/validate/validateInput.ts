import {
  invalidInput,
  emptyQueryString,
  textTooShort,
} from 'fullfiller-common/src/errorMessages';
import {
  inputType,
  queryInputType,
  textInputType,
  wordsArrayInputType,
  freqMapInputType,
} from 'fullfiller-common/src/types';
import { isObject } from 'fullfiller-common/src/utils';

function isInputQueryString(input: inputType): input is queryInputType {
  return typeof input === 'string';
}

function isInputText(input: inputType): input is textInputType {
  return (
    isObject(input) &&
    Object.keys(input).length === 2 &&
    typeof (input as textInputType).title === 'string' &&
    typeof (input as textInputType).body === 'string'
  );
}

function isInputWordsArray(input: inputType): input is wordsArrayInputType {
  return (
    isObject(input) &&
    Object.keys(input).length === 2 &&
    typeof (input as wordsArrayInputType).title === 'string' &&
    Array.isArray((input as wordsArrayInputType).words) &&
    (input as wordsArrayInputType).words.every(
      (word) => typeof word === 'string'
    )
  );
}

function isInputFreqMap(input: inputType): input is freqMapInputType {
  return (
    isObject(input) &&
    Object.keys(input).length === 2 &&
    typeof (input as freqMapInputType).title === 'string' &&
    isObject((input as freqMapInputType).map) &&
    Object.keys((input as freqMapInputType).map).every((key) =>
      /^\d+$/.test(key)
    ) &&
    Object.values((input as freqMapInputType).map).every(
      (value) =>
        Array.isArray(value) && value.every((el) => typeof el === 'string')
    )
  );
}

function validateInput(input: inputType): string[] {
  const errors: string[] = [];

  const isQueryString = isInputQueryString(input);
  const isText = isInputText(input);
  const isWordsArray = isInputWordsArray(input);
  const isFreqMap = isInputFreqMap(input);

  if (
    !(isQueryString || isText || isWordsArray || isFreqMap) // invalid input
  ) {
    errors.push(invalidInput);
  } else {
    // additional errors for specific input types

    if (isQueryString && input === '') {
      errors.push(emptyQueryString);
    }

    if (isText) {
      const wordsQuantityMinRequired = 150;
      const wordsQuantity = input.body.split(' ').length;

      if (wordsQuantity < wordsQuantityMinRequired) {
        errors.push(textTooShort);
      }
    }
  }

  return errors;
}

export default validateInput;
