/**
 * @file Node script to inspect cache for testing purposes.
 */

import fs from 'fs';
import { join } from 'path';

import cache from 'cacache';
import findCacheDir from 'find-cache-dir';

const base = findCacheDir({ name: 'fullfiller-api' });
console.log(base);

const queriesCacheDir = join(base, 'queries');
const freqMapsCacheDir = join(base, 'freqMaps');

(async () => {
  // lists info for all entries currently in the cache as a single large object
  const queriesCache = await cache.ls(queriesCacheDir);
  const freqMapsCache = await cache.ls(freqMapsCacheDir);

  console.log(queriesCache);
  console.log(freqMapsCache);

  // get first item in the queries cache and then its corresponding freqMap
  const query = fs.readFileSync(
    queriesCache[Object.keys(queriesCache)[0]].path,
    'utf8'
  );
  const freqMap = fs.readFileSync(freqMapsCache[query].path, 'utf8');

  console.log(query);
  console.log(freqMap);
})();
