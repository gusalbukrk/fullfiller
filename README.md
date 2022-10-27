> `fullfiller` is being built using some of the most popular tools for Web Development: TypeScript, React, Sass, Lerna, Express, Commander, Babel, Webpack, Rollup, Jest, ESLint, Stylelint, Husky, Lint-staged, Commitlint, ...

# fullfiller

> feature-rich filler text generator  
> try it out online at https://fullfiller.gusalbukrk.com/  
> also available as an API at https://fullfiller.gusalbukrk.com/api?query=harry%20potter  
> and CLI https://www.npmjs.com/package/fullfiller-cli

- `fullfiller` biggest advantage is that it's not a simple "Lorem ipsum" generator (there's plenty of those already). Neither, it's a custom generator with a pre-defined group of related words, like [baconipsum](baconipsum.com) & [hipsum](hipsum.co) (again, there's plenty of those already).
- Instead, it **generates a custom filler text from a given input**. Input can be a text, string array, frequency map or wikipedia query string.

## Install

- `npm i fullfiller`

- `fullfiller` is a **hybrid package**, which means it supports both ES Modules and CommonJS. Everything works out-of-the-box with no extra configuration needed. ESM module will load when you use `import` and CJS module, when you use `require`.
- Additionally, there's a UMD variant you can use for client-side code that won't be compiled. In this case, the best option is to use a CDN. In a HTML file, add a `script` pointing to the following URL: https://unpkg.com/fullfiller/dist/bundle.umd.js.

## Usage

`fullfiller` function takes 2 arguments: `input` and `options`.

- `input` (required) = valid types: _wikipedia query string_, _text_, _wordsArray_ & _freqMap_
- `options` (optional) = object containing (some or all of) the following properties: _unit_, _format_, _quantity_ and _requirements_

### Examples

#### query string as `input`

```javascript
import fullfiller from 'fullfiller';

(async function () {
  const input = 'harry potter';
  const filler = await fullfiller(input); // generate filler from Wikipedia article (in English)

  console.log(filler);
})();
```

#### text as `input`

```javascript
import fullfiller from 'fullfiller';

const input = {
  title: 'Harry Potter',
  body: "Harry Potter is a series of seven fantasy novels written by British author J. K. Rowling. The novels chronicle the lives of a young wizard, Harry Potter, and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main story arc concerns Harry's struggle against Lord Voldemort, a dark wizard who intends to become immortal, overthrow the wizard governing body known as the Ministry of Magic and subjugate all wizards and Muggles (non-magical people).\nSince the release of the first novel, Harry Potter and the Philosopher's Stone, on 26 June 1997, the books have found immense popularity, positive reviews, and commercial success worldwide. They have attracted a wide adult audience as well as younger readers and are often considered cornerstones of modern young adult literature. As of February 2018, the books have sold more than 500 million copies worldwide, making them the best-selling book series in history, and have been translated into eighty languages. The last four books consecutively set records as the fastest-selling books in history, with the final instalment selling roughly 2.7 million copies in the United Kingdom and 8.3 million copies in the United States within twenty-four hours of its release.\nThe series was originally published in English by Bloomsbury in the United Kingdom and Scholastic Press in the United States. All versions around the world are printed by Grafica Veneta in Italy.A play, Harry Potter and the Cursed Child, based on a story co-written by Rowling, premiered in London on 30 July 2016 at the Palace Theatre, and its script was published by Little, Brown. The original seven books were adapted into an eight-part namesake film series by Warner Bros. Pictures, which is the third-highest-grossing film series of all time as of February 2020. In 2016, the total value of the Harry Potter franchise was estimated at $25 billion, making Harry Potter one of the highest-grossing media franchises of all time.\nA series of many genres, including fantasy, drama, coming of age, and the British school story (which includes elements of mystery, thriller, adventure, horror, and romance), the world of Harry Potter explores numerous themes and includes many cultural meanings and references. According to Rowling, the main theme is death. Other major themes in the series include prejudice, corruption, and madness.The success of the books and films has allowed the Harry Potter franchise to expand with numerous derivative works, a traveling exhibition that premiered in Chicago in 2009, a studio tour in London that opened in 2012, a digital platform on which J. K. Rowling updates the series with new information and insight, and a pentalogy of spin-off films premiering in November 2016 with Fantastic Beasts and Where to Find Them, among many other developments. Most recently, themed attractions, collectively known as The Wizarding World of Harry Potter, have been built at several Universal Parks & Resorts amusement parks around the world.",
};

(async function () {
  const filler = await fullfiller(input); // generate filler from text

  console.log(filler);
})();
```

#### string array as `input`

```javascript
import fullfiller from 'fullfiller';

const input = {
  title: 'Harry Potter',
  words: [
    'Harry',
    'Potter',
    'series',
    'books',
    'novels',
    'wizard',
    'Hermione',
    'Ronny',
    'Hogwarts',
    'Voldemort',
    'Snape',
    'movies',
    'death',
    'franchise',
    'fantasy',
  ],
};

(async function () {
  const filler = await fullfiller(input); // generate filler from string array

  console.log(filler);
})();
```

#### frequency map as `input`

```javascript
import fullfiller from 'fullfiller';

const input = {
  title: 'Harry Potter',
  map: {
    1: ['fantasy', 'death'],
    2: ['novels', 'Voldemort', 'franchise'],
    3: ['wizard', 'movies', 'Snape'],
    5: ['series', 'Hermione', 'Ronny', 'Hogwarts'],
    8: ['books'],
    10: ['Harry', 'Potter'],
  },
};

(async function () {
  const filler = await fullfiller(input); // generate filler from frequency map

  console.log(filler);
})();
```

#### `options` (second parameter)

```javascript
import fullfiller from 'fullfiller';

(async function () {
  const input = 'harry potter';

  const options = {
    unit: 'paragraphs', // 'paragraphs' or 'words'
    quantity: 5, // number
    format: 'plain', // 'plain' or 'html'
    requirements: {
      sentencesPerParagraphMin: 4,
      sentencesPerParagraphMax: 8, // max must be at least min * 2 - 1
      wordsPerSentenceMin: 7,
      wordsPerSentenceMax: 13, // max must be at least min * 2 - 1
    },
  };

  const filler = await fullfiller(input, options);

  console.log(filler);
})();
```

### Related projects

#### monorepo subpackages

- [get-wikipedia-article](https://github.com/gusalbukrk/fullfiller/tree/main/packages/get-wikipedia-article): Fetch Wikipedia article resources.
- [stopwords-utils](https://github.com/gusalbukrk/fullfiller/tree/main/packages/stopwords-utils): Utilities for working with English stopwords.
- [tokenize-words](https://github.com/gusalbukrk/fullfiller/tree/main/packages/tokenize-words): Break down text into array of words.
- [generate-words-freqmap](https://github.com/gusalbukrk/fullfiller/tree/main/packages/generate-words-freqmap): Generate frequency map from array of strings.
- [weighted-randomness](https://github.com/gusalbukrk/fullfiller/tree/main/packages/weighted-randomness): Generate a weighted random function from a frequency map.
- [generate-random-text](https://github.com/gusalbukrk/fullfiller/tree/main/packages/generate-random-text): Randomly generate text using given frequency map.

#### similar

- [lorem-ipsum.js](https://github.com/knicklabs/lorem-ipsum.js): A Node.js module for generating lorem ipsum placeholder text.
