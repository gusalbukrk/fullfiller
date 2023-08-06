import { freqMapType } from 'fullfiller-common/src/types';

function getFreqMapWordsQuantity(freqMap: freqMapType): number {
  const wordsQuantity = Object.values(freqMap).reduce(
    (acc, cur) => acc + cur.length,
    0,
  );

  return wordsQuantity;
}

export default getFreqMapWordsQuantity;
