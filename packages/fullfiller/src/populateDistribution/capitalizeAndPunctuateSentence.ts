import { freqMapType, languagesType } from 'fullfiller-common/src/types';
import {
  capitalize,
  getRandomArrayElement,
  last,
  isNumeric,
} from 'fullfiller-common/src/utils';
import { isStopword as isStopwordBase } from 'stopwords-utils/src';
import weightedRandomness from 'weighted-randomness/src';

function capitalizeSentence(sentenceArray: string[]) {
  return [capitalize(sentenceArray[0]), ...sentenceArray.slice(1)];
}

function getRandomPunctuation(location: 'end' | 'mid') {
  const freqMap: freqMapType =
    location === 'end'
      ? { 1: ['...'], 3: ['!', '?'], 16: ['.'] }
      : { 1: ['[]'], 2: [';', ':'], 4: ['""', '()', '—  —'], 8: [','] }; // mid punctuation will be enclosing (quotes, parentheses, brackets, em dash) 1/3 of the time

  const punctuation = weightedRandomness(freqMap)();

  return punctuation;
}

function addEndSentencePunctuation(arr: string[]) {
  const sentenceArray = [...arr];

  if (!last(sentenceArray).endsWith('.')) {
    sentenceArray[sentenceArray.length - 1] += getRandomPunctuation('end');
  }

  return sentenceArray;
}

function addMidSentencePunctuation(arr: string[], language: languagesType) {
  const isStopword = (word: string) => isStopwordBase(word, language);

  const sentenceArray = [...arr];

  if (sentenceArray.length > 8 && Math.random() < 0.8) {
    // punctuation will be placed at a minimum the fourth word
    // and at a maximum at the fourth to last word
    const subarray = sentenceArray.slice(3, sentenceArray.length - 3);

    const randomPunctuation = getRandomPunctuation('mid');

    if (/,|:|;/.test(randomPunctuation)) {
      //  simple punctuation won't be placed between stopwords or numbers
      const filtered = subarray.filter((word) => {
        const nextWord = sentenceArray[sentenceArray.indexOf(word) + 1];

        return [word, nextWord].every((w) => !isStopword(w) && !isNumeric(w));
      });

      if (filtered.length > 0) {
        const randomWord = getRandomArrayElement(filtered);
        sentenceArray[sentenceArray.indexOf(randomWord)] += randomPunctuation;
      }
    } else {
      // enclosing punctuation won't be placed between stopwords

      const punctuationStartIndex = sentenceArray.indexOf(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        subarray.find((word) => {
          const previousWord = sentenceArray[sentenceArray.indexOf(word) - 1];
          return !isStopword(previousWord) && !isStopword(word);
        })!
      );

      const punctuationEndIndex =
        punctuationStartIndex === -1
          ? -1
          : sentenceArray.indexOf(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              [...subarray]
                .slice(subarray.indexOf(sentenceArray[punctuationStartIndex]))
                .reverse()
                .find((word) => {
                  const nextWord =
                    sentenceArray[sentenceArray.indexOf(word) + 1];

                  return !isStopword(word) && !isStopword(nextWord);
                })!
            );

      if (punctuationStartIndex !== -1 && punctuationEndIndex !== -1) {
        const [, openingPunctuation, closingPunctuation] =
          /(\(|\[|"|—\s)(\)|]|"|\s—)/.exec(randomPunctuation) || [];

        sentenceArray[
          punctuationStartIndex
        ] = `${openingPunctuation}${sentenceArray[punctuationStartIndex]}`;

        sentenceArray[punctuationEndIndex] += closingPunctuation;
      }
    }
  }

  return sentenceArray;
}

function capitalizeAndPunctuateSentence(
  arr: string[],
  language: languagesType
): string[] {
  const sentenceArray = [...arr];

  return capitalizeSentence(
    addEndSentencePunctuation(
      addMidSentencePunctuation(sentenceArray, language)
    )
  );
}

export default capitalizeAndPunctuateSentence;
