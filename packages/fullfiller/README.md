# fullfiller

Generate subject-specific filler text in dozens of languages using the Wikipedia API.

## Install

- `npm i fullfiller`

## Usage

```js
import fullfiller from 'fullfiller';

const article = await fullfiller(
  // 4 valid input types: Wikipedia query string, text, words array and frequency map
  'harry potter',

  {
    // options object (optional)
    language: 'es', // ISO 639-1 language code
    unit: 'words', // 'words' (default) or 'paragraphs'
    quantity: 250,
    format: 'html', // 'plain' (default) or 'html'
  },
);

console.log(article);
```
