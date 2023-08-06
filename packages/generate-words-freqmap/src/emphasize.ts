import { freqMapWordAsKeyType } from './common/types';

/**
 * Every freqMap's word in `wordsToEmphasize` will have their weight multiplied by `emphasizeBy`.
 */
function emphasize(
  freqMapWordAsKey: freqMapWordAsKeyType,
  wordsToEmphasize: string[],
  emphasizeBy: number,
): freqMapWordAsKeyType {
  return wordsToEmphasize.reduce(
    (freqMap, word) =>
      freqMap[word] === undefined
        ? freqMap
        : {
            ...freqMap,
            [word]: Math.round(freqMap[word] * emphasizeBy),
          },
    freqMapWordAsKey,
  );
}

export default emphasize;
