import { freqMapType, fillerBodyArrayType } from 'fullfiller-common/src/types';
import weightedRandomness from 'weighted-randomness/src';

import capitalizeAndPunctuateSentence from './capitalizeAndPunctuateSentence';
import getRandomWord from './getRandomWord';

function populateDistribution(
  freqMap: freqMapType,
  distribution: number[][]
): fillerBodyArrayType {
  const getRandomArticleWord = weightedRandomness(freqMap);

  const populated = distribution.map((paragraphBreakdown) =>
    paragraphBreakdown.map((sentenceIntendedLength) =>
      capitalizeAndPunctuateSentence(
        Array.from({ length: sentenceIntendedLength }).reduce<string[]>(
          (sentence) =>
            sentence.concat(
              getRandomWord(
                sentence,
                sentenceIntendedLength,
                getRandomArticleWord
              )
            ),
          []
        )
      )
    )
  );

  return populated;
}

export default populateDistribution;
