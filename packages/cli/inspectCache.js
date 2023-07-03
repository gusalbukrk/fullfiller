/**
 * @file Node script to inspect cache for testing purposes.
 */

/* eslint-disable no-console */

import { join } from 'path';

import cache from 'cacache';
import findCacheDir from 'find-cache-dir';

const base = findCacheDir({ name: 'fullfiller-api' });
console.log(base);

const queriesCacheDir = join(base, 'queries');
const freqMapsCacheDir = join(base, 'freqMaps');

(async () => {
  // lists info for all entries currently in the cache as a single large object
  const queriesCacheLs = await cache.ls(queriesCacheDir);
  const freqMapsCacheLs = await cache.ls(freqMapsCacheDir);

  console.log(queriesCacheLs);
  console.log(freqMapsCacheLs);

  // get first record in the freqMaps cache
  const freqMapsCacheValue = (
    await cache.get(freqMapsCacheDir, Object.keys(freqMapsCacheLs)[0])
  ).data.toString();

  console.log(freqMapsCacheValue);
})();

/* eslint-enable no-console */
