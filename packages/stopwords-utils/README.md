# stopwords-utils

Utilities for working with English stopwords.

## isStopword

```js
import { isStopword } from 'stopwords-utils';

isStopword('the'); // true
isStopword('foo'); // false
```

## generateGetRandomStopwordFn

```js
import { generateGetRandomStopwordFn } from 'stopwords-utils';

const getRandomStopword = generateGetRandomStopwordFn();

getRandomStopword(); // 'and'
getRandomStopword(); // 'the'
getRandomStopword(); // 'of'
```
