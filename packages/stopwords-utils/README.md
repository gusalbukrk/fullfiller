# stopwords-utils

Utilities for working with stopwords in 50 languages.

## Install

- `npm i stopwords-utils`

## Usage

### isStopword

```js
import { isStopword } from 'stopwords-utils';

console.log(isStopword('the')); // true

// second argument is optional and it takes a ISO 639-1 language code
console.log(isStopword('más', 'es')); // true
```

### generateGetRandomStopwordFn

```js
import { generateGetRandomStopwordFn } from 'stopwords-utils';

const getRandomStopwordEn = generateGetRandomStopwordFn();
console.log(getRandomStopwordEn());

const getRandomStopwordEs = generateGetRandomStopwordFn('es');
console.log(getRandomStopwordEs());
```
