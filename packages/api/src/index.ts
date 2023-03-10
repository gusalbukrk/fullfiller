import express from 'express';
import fullfiller from 'fullfiller/src';
import {
  unitType,
  formatType,
  sentencesPerParagraphType,
  wordsPerSentenceType,
} from 'fullfiller-common/src/types';

import 'cross-fetch/dist/node-polyfill';

const app = express();

type baseType = {
  query: string;
  unit: unitType;
  quantity: number;
  format: formatType;
};

type inputType = {
  sentencesPerParagraphMin: number;
  sentencesPerParagraphMax: number;
  wordsPerSentenceMin: number;
  wordsPerSentenceMax: number;
} & baseType;

type optionsType = {
  sentencesPerParagraph: Partial<sentencesPerParagraphType>;
  wordsPerSentence: Partial<wordsPerSentenceType>;
} & baseType;

// middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(express.static('../site/dist/'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/api/', async (req, res) => {
  // endpoint will receive requests of 2 types:
  // - requests with query parameters, e.g. `?query=harry potter&format=html`
  // - requests with bodies containing json or urlencoded data

  const { query, ...options } =
    Object.keys(req.query).length !== 0
      ? (req.query as unknown as optionsType)
      : (req.body as unknown as optionsType);

  if (options.quantity)
    options.quantity = parseInt(options.quantity as unknown as string, 10);

  const article = await fullfiller(query, options);

  res.status(200).json(article);
});

app.get(
  '/api/:query/:unit?/:quantity?/:format?/:sentencesPerParagraphMin?/:sentencesPerParagraphMax?/:wordsPerSentenceMin?/:wordsPerSentenceMax?',
  async (req: { params: inputType }, res) => {
    const { params } = req;

    const { query } = params;

    const options: Partial<optionsType> = {
      ...(params.unit !== undefined ? { unit: params.unit } : {}),
      ...(params.quantity !== undefined
        ? { quantity: parseInt(params.quantity as unknown as string, 10) }
        : {}),
      ...(params.format !== undefined ? { format: params.format } : {}),

      sentencesPerParagraph: {},
      wordsPerSentence: {},
    };

    if (params.sentencesPerParagraphMin !== undefined)
      options.sentencesPerParagraph!.min = parseInt(
        params.sentencesPerParagraphMin as unknown as string,
        10
      );

    if (params.sentencesPerParagraphMax !== undefined)
      options.sentencesPerParagraph!.max = parseInt(
        params.sentencesPerParagraphMax as unknown as string,
        10
      );

    if (params.wordsPerSentenceMin !== undefined)
      options.wordsPerSentence!.min = parseInt(
        params.wordsPerSentenceMin as unknown as string,
        10
      );

    if (params.wordsPerSentenceMax !== undefined)
      options.wordsPerSentence!.max = parseInt(
        params.wordsPerSentenceMax as unknown as string,
        10
      );

    const article = await fullfiller(query, options); // eslint-disable-line @typescript-eslint/no-non-null-assertion

    res.status(200).json(article);
  }
);

const PORT = process.env.PORT || 8888;

app.listen(
  PORT,
  () => console.log(`Server is running at http://localhost:${PORT}.`) // eslint-disable-line no-console
);
