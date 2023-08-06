import { freqMapType } from 'fullfiller-common/src/types';
import { last } from 'fullfiller-common/src/utils';

/** e.g.: `{ 1: [...], 2: [...], 3: [...] }` => `[ [1, 2, 3], [1, 3, 6] ]` */
function getWeightsAndRangesFromFreqMap(freqMap: freqMapType): number[][] {
  // ES2015 own property order
  // while traversing objects, integer keys are returned first and in ascending order
  // https://2ality.com/2015/10/property-traversal-order-es6.html
  const weights = Object.keys(freqMap).map((weight) => Number(weight));

  const ranges = weights.reduce<number[]>(
    (acc, weight) => acc.concat((last(acc) || 0) + weight),
    [],
  );

  return [weights, ranges];
}

export default getWeightsAndRangesFromFreqMap;
