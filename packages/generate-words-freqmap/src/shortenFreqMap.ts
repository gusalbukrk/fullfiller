import { freqMapType } from 'fullfiller-common/src/types';

/** If required by `options`, reduce the quantity of tiers in `freqMap`. */
function shortenFreqMap(
  freqMap: freqMapType,
  tierWeightMin: number,
  tierWeightMax: number,
  mergePosteriorTiersAt: number
): freqMapType {
  return Object.entries(freqMap).reduce((shortened, entry) => {
    const weight = Number(entry[0]);
    const tier = entry[1];

    // if current weight is less than min or more than max, filter out current tier
    if (
      weight < tierWeightMin ||
      (tierWeightMax !== -1 && // -1 would indicate that `tierWeightMax` functionality is disabled
        weight > tierWeightMax)
    ) {
      return shortened;
    }

    // if current weight is more than mergePosteriorTiersAt
    // merge current tier into mergePosteriorTiersAt tier
    if (
      mergePosteriorTiersAt !== -1 && // -1 would indicate that `mergePosteriorTiersAt` functionality is disabled
      weight > mergePosteriorTiersAt
    ) {
      return {
        ...shortened,
        [mergePosteriorTiersAt]: (
          shortened[mergePosteriorTiersAt] || []
        ).concat(freqMap[weight]),
      };
    }

    return { ...shortened, [weight]: tier };
  }, {} as freqMapType);
}

export default shortenFreqMap;
