import { requirementsDefault } from 'fullfiller-common/src/constants';
import * as errorMessages from 'fullfiller-common/src/errorMessages';
import {
  inputType,
  unitType,
  formatType,
  requirementsType,
} from 'fullfiller-common/src/types';
import { paramsToObjParam } from 'fullfiller-common/src/utils';

import validateBase from '.';

type validateInterface = {
  input: inputType;
  unit: unitType;
  quantity: number;
  format: formatType;
  requirements: requirementsType;
};

const defaults: validateInterface = {
  input: '...',
  unit: 'paragraphs',
  quantity: 5,
  format: 'plain',
  requirements: requirementsDefault,
};

const validate = paramsToObjParam(validateBase, defaults);

describe('throw error messages correctly', () => {
  it('input argument', () => {
    expect.assertions(4);

    // @ts-expect-error: test
    const w = () => validate({ input: true });

    // @ts-expect-error: test
    const x = () => validate({ input: () => null });

    const y = () => validate({ input: '' });
    const z = () => validate({ input: { title: 'test', body: '' } });

    expect(w).toThrow(errorMessages.invalidInput);
    expect(x).toThrow(errorMessages.invalidInput);
    expect(y).toThrow(errorMessages.emptyQueryString);
    expect(z).toThrow(errorMessages.textTooShort);
  });

  it('unit argument', () => {
    expect.assertions(2);

    // @ts-expect-error: test
    const x = () => validate({ unit: '' });
    // @ts-expect-error: test
    const y = () => validate({ unit: 'abcde' });

    expect(x).toThrow(errorMessages.invalidUnit);
    expect(y).toThrow(errorMessages.invalidUnit);
  });

  it('quantity argument', () => {
    expect.assertions(2);

    // @ts-expect-error: test
    const x = () => validate({ quantity: '...' });
    const y = () => validate({ quantity: 0 });

    expect(x).toThrow(errorMessages.quantityNotNumber);
    expect(y).toThrow(errorMessages.quantityTooSmall);
  });

  it('format argument', () => {
    expect.assertions(2);

    // @ts-expect-error: test
    const x = () => validate({ format: '' });
    // @ts-expect-error: test
    const y = () => validate({ format: 'abcde' });

    expect(x).toThrow(errorMessages.invalidFormat);
    expect(y).toThrow(errorMessages.invalidFormat);
  });

  it('requirements argument', () => {
    expect.assertions(4);

    // @ts-expect-error: test
    const w = () => validate({ requirements: {} });
    const x = () =>
      validate({
        requirements: {
          ...requirementsDefault,
          wordsPerSentenceMin: 2,
        },
      });
    const y = () =>
      validate({
        requirements: {
          ...requirementsDefault,
          sentencesPerParagraphMin: 5,
          sentencesPerParagraphMax: 5,
        },
      });
    const z = () =>
      validate({
        requirements: {
          ...requirementsDefault,
          wordsPerSentenceMin: 5,
          wordsPerSentenceMax: 5,
        },
      });

    expect(w).toThrow(errorMessages.invalidRequirements);
    expect(x).toThrow(errorMessages.requirementsValuesTooSmall);
    expect(y).toThrow(errorMessages.invalidRequirementsSentencesPerParagraph);
    expect(z).toThrow(errorMessages.invalidRequirementsWordsPerSentence);
  });
});
