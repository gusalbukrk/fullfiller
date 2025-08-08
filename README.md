# fullfiller

Generate subject-specific filler text in dozens of languages using the Wikipedia API.

## Web app

Try it out online at https://fullfiller.gusalbukrk.com/.

## API

Examples:

- https://fullfiller.gusalbukrk.com/api?query=harry%20potter: generate 5 paragraphs of filler text about "harry potter" in English
- https://fullfiller.gusalbukrk.com/api/harry%20potter/es/paragraphs/3/html: generate 3 paragraphs of filler text about "harry potter" in Spanish, formatted as HTML
- More examples can be found [here](./packages/api/requests.http).

## CLI

1. `npm install -g fullfiller-cli`
2. `fullfiller --help`: get help
3. `fullfiller 'harry potter' -l es -u 'paragraphs' -q 5 -f 'html'`: generate 5 paragraphs of filler text about "harry potter" in Spanish, formatted as HTML.

## Library

1. `npm i fullfiller`
2. Import the library and use it in your code:

```javascript
import fullfiller from 'fullfiller';

const text = await fullfiller('harry potter', {
  unit: 'paragraphs',
  quantity: 3,
  format: 'html',
});

console.log(text);
```
