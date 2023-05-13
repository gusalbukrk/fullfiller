import {
  freqMapType,
  fillerBodyArrayType,
  languageType,
} from 'fullfiller-common/src/types';
import { generateGetRandomStopwordFn } from 'stopwords-utils/src';
import weightedRandomness from 'weighted-randomness/src';

import capitalizeAndPunctuateSentence from './capitalizeAndPunctuateSentence';
import getRandomWord from './getRandomWord';

function populateDistribution(
  freqMap: freqMapType,
  language: languageType,
  distribution: number[][]
): fillerBodyArrayType {
  const getRandomArticleWord = weightedRandomness(freqMap);
  const getRandomStopword = generateGetRandomStopwordFn(language);

  const populated = distribution.map((paragraphBreakdown) =>
    paragraphBreakdown.map((sentenceIntendedLength) =>
      capitalizeAndPunctuateSentence(
        Array.from({ length: sentenceIntendedLength }).reduce<string[]>(
          (sentence) =>
            sentence.concat(
              getRandomWord(
                sentence,
                sentenceIntendedLength,
                language,
                getRandomArticleWord,
                getRandomStopword
              )
            ),
          []
        ),
        language
      )
    )
  );

  return populated;
}

export default populateDistribution;
