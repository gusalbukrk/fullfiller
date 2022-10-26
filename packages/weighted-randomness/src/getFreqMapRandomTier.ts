import { freqMapType } from 'fullfiller-common/src/types';
import { last, getRandomNumber } from 'fullfiller-common/src/utils';

function getRangeRespectiveFreqMapWeight(
  range: number,
  weights: number[],
  ranges: number[]
): number {
  const index = ranges.findIndex((r) => r >= range);
  const weight = weights[index];

  return weight;
}

/** Using weighted randomness, select one of the freqMap's tier. */
function getFreqMapRandomTier(
  freqMap: freqMapType,
  weights: number[],
  ranges: number[]
): string[] {
  const range = getRandomNumber(1, last(ranges));
  const weight = getRangeRespectiveFreqMapWeight(range, weights, ranges);

  const tier = freqMap[weight];

  return tier;
}

export { getRangeRespectiveFreqMapWeight }; // for testing purposes

export default getFreqMapRandomTier;
