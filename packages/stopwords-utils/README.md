# stopwords-utils

Utilities for working with English stopwords.

## Utils

### isStopword

```js
import { isStopword } from 'stopwords-utils';

isStopword('the'); // true
isStopword('foo'); // false
```

### getRandomStopword

```js
import { getRandomStopword } from 'stopwords-utils';

getRandomStopword(); // 'and'
getRandomStopword(); // 'the'
getRandomStopword(); // 'of'
```

## License

### [stopwords.json](./src/stopwords.json)

Copyright (c) 2017 Peter Graham, contributors. Released under the Apache-2.0 license. With the following sources:

- [Apache Lucene](http://lucene.apache.org/) - [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0)
- [Carrot2](https://github.com/carrot2/carrot2) - [License](http://project.carrot2.org/license.html)
- [cue.language](https://github.com/vcl/cue.language) - [Apache 2.0 License](https://github.com/vcl/cue.language/blob/master/license.txt)
- [Jacques Savoy](http://members.unine.ch/jacques.savoy/clef/index.html) - BSD License
- SMART Information Retrieval System: ftp://ftp.cs.cornell.edu/pub/smart/
- [ASP Stoplist Project](https://github.com/dohliam/more-stoplists) - CC-BY and Apache 2.0
