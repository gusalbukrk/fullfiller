import { freqMapWordAsKeyType } from './common/types';

/** **freqMapWordAsKey** example: `{ foo: 1, bar: 3 }` */
function generateFreqMapWordAsKey(
  wordsArray: string[],
  caseInsensitive: boolean,
): freqMapWordAsKeyType {
  return wordsArray.reduce((freqMap, word) => {
    const w = caseInsensitive ? word.toLowerCase() : word;

    return {
      ...freqMap,

      // using hasOwnProperty instead of check if undefined, otherwise
      // if `word` is a built-in object property (e.g. `constructor`)
      // would append 1 to this property (which would results in `NaN`)
      // instead of creating a new property
      [w]: Object.prototype.hasOwnProperty.call(freqMap, w)
        ? freqMap[w] + 1
        : 1,
    };
  }, {} as freqMapWordAsKeyType);
}

export default generateFreqMapWordAsKey;
