import { getRandomNumber } from 'fullfiller-common/src/utils';

import breakNumberIntoChunks from './breakNumberIntoChunks';

describe.each(Array.from({ length: 100 }).map(() => getRandomNumber(10, 500)))(
  'breakNumberIntoChunks',
  (number) => {
    const chunkValueMin = getRandomNumber(1, number);
    const chunkValueMax = getRandomNumber(
      Math.min(
        chunkValueMin * 2 - 1, // otherwise, error
        number,
      ),
      number,
    );

    const distributionLengthMin = Math.ceil(number / chunkValueMax);
    const distributionLengthMax = Math.floor(number / chunkValueMin);

    const distribution = breakNumberIntoChunks(
      number,
      chunkValueMin,
      chunkValueMax,
      distributionLengthMin,
      distributionLengthMax,
    );

    it('distribution sum is equal to given number', () => {
      expect.assertions(1);

      const sum = distribution.reduce((acc, cur) => acc + cur);

      expect(sum).toStrictEqual(number);
    });

    it('each chunk value conforms to given min, max', () => {
      expect.assertions(2);

      const min = Math.min(...distribution);
      const max = Math.max(...distribution);

      expect(min).toBeGreaterThanOrEqual(chunkValueMin);
      expect(max).toBeLessThanOrEqual(chunkValueMax);
    });

    it('distribution array length conforms to given min, max', () => {
      expect.assertions(2);

      const len = distribution.length;

      expect(len).toBeGreaterThanOrEqual(distributionLengthMin);
      expect(len).toBeLessThanOrEqual(distributionLengthMax);
    });
  },
);
