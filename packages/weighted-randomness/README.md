# weighted-randomness

Generate a weighted random function from a frequency map. Every time the returned function is called, it'll return one of the words inside `freqMap`.

## Install

- `npm i weighted-randomness`

## Usage

```javascript
import weightedRandomness from 'weighted-randomness';

const freqMap = {
  1: ['qux'],
  2: ['bar', 'baz'],
  4: ['foo'],
};

const randomFn = weightedRandomness(freqMap);

for (let i = 0; i < 10; i++) console.log(randomFn());
```
