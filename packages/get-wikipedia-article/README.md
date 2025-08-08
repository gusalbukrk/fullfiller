# get-wikipedia-article

Fetch Wikipedia article resources (e.g. title, body, links, ...).

## Install

- `npm i get-wikipedia-article`

## Usage

```js
import getWikipediaArticle from 'get-wikipedia-article';

const article = await getWikipediaArticle('harry potter', {
  // options object (optional)
  language: 'es', // ISO 639-1 code (default: 'en')

  include: [
    // default: ['title', 'body']
    'title',
    'body',
    'related',
    'summary',
    'links',
    'categories',
    'description',
    'alias',
    'label',
  ],

  format: 'html', // 'plain' (default) or 'html'
});

console.log(article);
```
