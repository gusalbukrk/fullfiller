import { languageType } from 'fullfiller-common/src/types';
import { isNumeric } from 'fullfiller-common/src/utils';
import { isStopword as isStopwordBase } from 'stopwords-utils/src';

import suffixes from './suffixes.json';

/** naive stemming implementation for a subset of the languages in languageType */
function stem(word: string, language: languageType) {
  if (!(language in suffixes)) return word;

  const suffix = suffixes[language as keyof typeof suffixes].find((s) =>
    word.endsWith(s),
  );

  return suffix === undefined ? word : word.slice(0, -suffix.length);
}

function isWordPlacementInvalid(
  randomWord: string,
  sentence: string[],
  sentenceIntendedLength: number,
  language: languageType,
) {
  return (
    sentence
      .map((w) => stem(w.toLocaleLowerCase(), language))
      .includes(stem(randomWord.toLocaleLowerCase(), language)) ||
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
  language: languageType,
  getRandomArticleWord: () => string,
  getRandomStopword: () => string,
): string {
  const isStopword = (word: string) => isStopwordBase(word, language);

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
    isWordPlacementInvalid(
      randomWord,
      sentence,
      sentenceIntendedLength,
      language,
    )
  );

  return randomWord;
}

export default getRandomWord;
