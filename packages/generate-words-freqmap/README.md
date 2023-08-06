# generate-words-freqmap

Generate frequency map from array of words.

## Install

- `npm i generate-words-freqmap`

## Usage

```javascript
import generateFreqMap from 'generate-words-freqmap';

const freqMap = generateFreqMap(
  ['foo', 'Bar', 'QUX', 'foo', 'foo', 'baz', 'bar', 'Foo'],

  ['baz'], // wordsToEmphasize (optional)

  {
    // options object (optional)
    emphasizeBy: 3, // each word in `wordsToEmphasize` will have their weight multiplied by number
    wordsQuantityMin: 3, // error if total of words in freqMap is lower than number

    // filter out tiers with weight outside of this range
    tierWeightMin: 1,
    tierWeightMax: 3,

    // any tiers with weight higher than number will be merged into tier with weight equal to number
    mergePosteriorTiersAt: 2,

    // convert all words to lowercase before processing
    caseInsensitive: true,
  },
);

console.log(freqMap); // { '1': [ 'qux' ], '2': [ 'bar', 'baz' ] }
```
