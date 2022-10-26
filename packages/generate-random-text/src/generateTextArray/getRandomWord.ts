import {
  capitalize,
  isLowercase,
  isNumeric,
} from 'fullfiller-common/src/utils';
import { isStopword, getRandomStopword } from 'stopwords-utils/src';

function isWordPlacementInvalid(
  randomWord: string,
  sentence: string[],
  sentenceIntendedLength: number
) {
  return (
    sentence.includes(randomWord) ||
    // don't include multiple instances of the same word with different casing
    (isLowercase(randomWord[0])
      ? sentence.includes(capitalize(randomWord))
      : sentence.includes(randomWord.toLowerCase())) ||
    // don't start or end sentence with number, nor have more than one number per sentence
    (isNumeric(randomWord) &&
      (sentence.length === 0 ||
        sentence.length === sentenceIntendedLength - 1 ||
        sentence.some((word) => isNumeric(word))))
  );
}

function getRandomWord(
  sentence: string[],
  sentenceIntendedLength: number,
  getRandomArticleWord: () => string
): string {
  let randomWord: string;

  do {
    if (
      // last word in sentence must not be stopword
      sentence.length === sentenceIntendedLength - 1 ||
      // doesn't allow more than 2 subsequent stopwords
      (sentence.length >= 2 &&
        sentence.slice(-2).every((word) => isStopword(word)))
    ) {
      randomWord = getRandomArticleWord();
    } else if (
      // doesn't allow more than 3 subsequent non-stopwords
      (sentence.length >= 3 &&
        sentence.slice(-3).every((word) => !isStopword(word))) ||
      // the 3 words before last word in sentence mustn't be all non-stopwords
      // because last word must be a stopword
      (sentenceIntendedLength - sentence.length === 2 &&
        sentence.slice(-2).every((word) => !isStopword(word)))
    ) {
      randomWord = getRandomStopword();
    } else {
      randomWord =
        Math.random() < 0.666 ? getRandomArticleWord() : getRandomStopword();
    }
  } while (
    isWordPlacementInvalid(randomWord, sentence, sentenceIntendedLength)
  );

  return randomWord;
}

export default getRandomWord;
