import {
  freqMapType,
  fillerBodyArrayType,
  languagesType,
} from 'fullfiller-common/src/types';
import { getRandomStopword as getRandomStopwordBase } from 'stopwords-utils/src';
import weightedRandomness from 'weighted-randomness/src';

import capitalizeAndPunctuateSentence from './capitalizeAndPunctuateSentence';
import getRandomWord from './getRandomWord';

function populateDistribution(
  freqMap: freqMapType,
  language: languagesType,
  distribution: number[][]
): fillerBodyArrayType {
  const getRandomArticleWord = weightedRandomness(freqMap);
  const getRandomStopword = getRandomStopwordBase(language);

  const populated = distribution.map((paragraphBreakdown) =>
    paragraphBreakdown.map((sentenceIntendedLength) =>
      capitalizeAndPunctuateSentence(
        Array.from({ length: sentenceIntendedLength }).reduce<string[]>(
          (sentence) =>
            sentence.concat(
              getRandomWord(
                sentence,
                sentenceIntendedLength,
                getRandomArticleWord,
                getRandomStopword
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
