/* eslint-disable */
import { isStopword, getRandomStopword } from './index';

describe('isStopword', () => {
  it('case insensitive', () => {
    expect.assertions(3);

    expect(isStopword('the')).toBe(true);
    expect(isStopword('The')).toBe(true);
    expect(isStopword('THE')).toBe(true);
  });

  // it(`single letter isn't stopword, except 'a' & 'i'`, () => {
  //   expect.assertions(4);

  //   expect(isStopword('a')).toBe(true);
  //   expect(isStopword('i')).toBe(true);
  //   expect(isStopword('t')).toBe(false);
  //   expect(isStopword('e')).toBe(false);
  // });
});

// describe('getRandomStopword', () => {
//   it('all words in freqMap are returned', () => {
//     expect.assertions(1);

//     const stopwordsFreqMapCount = Object.keys(stopwordsFreqMap).reduce(
//       (count, key) =>
//         count + stopwordsFreqMap[key as keyof typeof stopwordsFreqMap].length,
//       0
//     );

//     function allWordsInFreqMapAreReturned(
//       stopwords: Set<string> = new Set()
//     ): true {
//       const stopwordsUpdated = new Set([...stopwords]).add(getRandomStopword());

//       return stopwordsUpdated.size === stopwordsFreqMapCount
//         ? true
//         : allWordsInFreqMapAreReturned(stopwordsUpdated);
//     }

//     expect(allWordsInFreqMapAreReturned()).toBe(true);
//   });
// });
