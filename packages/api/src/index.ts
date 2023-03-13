import express from 'express';
import fullfiller from 'fullfiller/src';
import {
  unitType,
  formatType,
  sentencesPerParagraphType,
  wordsPerSentenceType,
} from 'fullfiller-common/src/types';

import 'cross-fetch/dist/node-polyfill';

type optionsType = Partial<{
  unit: unitType;
  quantity: number;
  format: formatType;

  // breakdown options
  sentencesPerParagraph: Partial<sentencesPerParagraphType>;
  wordsPerSentence: Partial<wordsPerSentenceType>;
}>;

type inputsType = { query: string } & optionsType;

// requests with query parameters or route parameters doesn't support objects
// those requests may contain flat breakdown options which must be converted to an object(s)
// before being passed to fullfiller function
// e.g. wordsPerSentenceMin => wordsPerSentence.min
type flatInputsType = Omit<
  inputsType,
  'sentencesPerParagraph' | 'wordsPerSentence'
> &
  Partial<{
    sentencesPerParagraphMin: number;
    sentencesPerParagraphMax: number;
    wordsPerSentenceMin: number;
    wordsPerSentenceMax: number;
  }>;

const parseIntRadix10 = (n: string) => parseInt(n, 10);

// filter out properties like wordsPerSentenceMin
function filterOutFlatBreakdownOptions(inputs: flatInputsType): inputsType {
  return Object.fromEntries(
    Object.entries(inputs).filter(
      (
        [k, v] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        ![
          'sentencesPerParagraphMin',
          'sentencesPerParagraphMax',
          'wordsPerSentenceMin',
          'wordsPerSentenceMax',
        ].includes(k)
    )
  ) as unknown as inputsType;
}

// convert flat breakdown options to objects
// e.g. wordsPerSentenceMin => wordsPerSentence.min
function unflattenBreakdownOptions(inputs: flatInputsType): inputsType {
  return {
    sentencesPerParagraph: {
      ...(inputs.sentencesPerParagraphMin !== undefined
        ? {
            min: parseIntRadix10(
              inputs.sentencesPerParagraphMin as unknown as string
            ),
          }
        : {}),
      ...(inputs.sentencesPerParagraphMax !== undefined
        ? {
            max: parseIntRadix10(
              inputs.sentencesPerParagraphMax as unknown as string
            ),
          }
        : {}),
    },

    wordsPerSentence: {
      ...(inputs.wordsPerSentenceMin !== undefined
        ? {
            min: parseIntRadix10(
              inputs.wordsPerSentenceMin as unknown as string
            ),
          }
        : {}),
      ...(inputs.wordsPerSentenceMax !== undefined
        ? {
            max: parseIntRadix10(
              inputs.wordsPerSentenceMax as unknown as string
            ),
          }
        : {}),
    },
  } as inputsType;
}

const app = express();

// middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(express.static('../site/dist/'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// endpoint handles requests of 2 types:
// - requests with query parameters, e.g. `?query=harry potter&format=html`
// - requests with a body containing json or urlencoded data
app.get(
  '/api/',
  async (req: { query: flatInputsType; body: inputsType }, res) => {
    const inputs = Object.keys(req.query).length !== 0 ? req.query : req.body;

    const { query, ...options } = {
      // if query parameters, must convert breakdown options to objects
      // if body, breakdown options already are objects
      ...(inputs === req.query
        ? {
            ...filterOutFlatBreakdownOptions(inputs),
            ...unflattenBreakdownOptions(inputs),
          }
        : inputs),

      ...(inputs.quantity !== undefined
        ? { quantity: parseIntRadix10(inputs.quantity as unknown as string) }
        : {}),
    };

    console.log(options);
    const article = await fullfiller(query, options);

    res.status(200).json(article);
  }
);

// endpoint handles requests with route parameters (also known as path)
app.get(
  '/api/:query/:unit?/:quantity?/:format?/:sentencesPerParagraphMin?/:sentencesPerParagraphMax?/:wordsPerSentenceMin?/:wordsPerSentenceMax?',
  async (req: { params: flatInputsType }, res) => {
    const inputs = req.params;

    const { query, ...options } = {
      ...filterOutFlatBreakdownOptions(inputs),
      ...unflattenBreakdownOptions(inputs),

      ...(inputs.quantity !== undefined
        ? {
            quantity: parseIntRadix10(inputs.quantity as unknown as string),
          }
        : {}),
    };

    console.log(options);
    const article = await fullfiller(query, options);

    res.status(200).json(article);
  }
);

const PORT = process.env.PORT || 8888;

app.listen(
  PORT,
  () => console.log(`Server is running at http://localhost:${PORT}.`) // eslint-disable-line no-console
);
