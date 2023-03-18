# get-wikipedia-article

Fetch Wikipedia article resources (e.g. title, body, links...).

## Basic Usage

```js
import getWikipediaArticle from 'get-wikipedia-article';

(async function () {
  const article = await getWikipediaArticle('harry potter');

  console.log(article);
})();
```

### Optional parameters

- `includes` = array containing which resources to fetch
  - valid options: `title`, `body`, `related`, `summary`, `links` `categories`, `terms`, `description`, `alias`
  - default value: `['title', 'body']`
- `options` = object containing miscellaneous options
  - `format` = `plain` (default) or `html`

## Todo

- replace all `encodeURIComponent` calls with `URL` constructor
- implement warnings about:
  - progress (warning when starting to fetch each resource)
  - getArticleTerms doesn't return all terms requested
