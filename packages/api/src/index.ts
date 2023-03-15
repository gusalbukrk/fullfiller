import express from 'express';
import fullfiller from 'fullfiller/src';
import {
  unitType,
  formatType,
  sentencesPerParagraphType,
  wordsPerSentenceType,
  breakdownOptionType,
} from 'fullfiller-common/src/types';
import { objectFilter, parseIntR10 } from 'fullfiller-common/src/utils';

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

// requests with route parameters doesn't support objects
// those requests may contain flat breakdown options which must be unflatten (converted to objects)
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

// query parameters to be converted: quantity, sentencesPerParagraph and wordsPerSentence
function convertNumericQueryStringsToNumbers(inputs: inputsType) {
  return Object.fromEntries(
    Object.entries(inputs).map(([k, v]) => {
      if (k === 'quantity') return [k, parseIntR10(v as number)];

      if (k === 'sentencesPerParagraph' || k === 'wordsPerSentence') {
        return [
          k,
          {
            ...((v as breakdownOptionType).min !== undefined
              ? {
                  min: parseIntR10((v as breakdownOptionType).min),
                }
              : {}),

            ...((v as breakdownOptionType).max !== undefined
              ? {
                  max: parseIntR10((v as breakdownOptionType).max),
                }
              : {}),
          },
        ];
      }

      return [k, v];
    })
  ) as inputsType;
}

function unflattenBreakdownOptions(inputs: flatInputsType): inputsType {
  return {
    // filter out flat breakdown options (e.g. wordsPerSentenceMin)
    ...objectFilter(
      inputs,
      ([k]) =>
        ![
          'sentencesPerParagraphMin',
          'sentencesPerParagraphMax',
          'wordsPerSentenceMin',
          'wordsPerSentenceMax',
        ].includes(k)
    ),

    // convert flat breakdown options to objects (e.g. wordsPerSentenceMin => wordsPerSentence.min)
    sentencesPerParagraph: {
      ...(inputs.sentencesPerParagraphMin !== undefined
        ? {
            min: parseIntR10(inputs.sentencesPerParagraphMin),
          }
        : {}),

      ...(inputs.sentencesPerParagraphMax !== undefined
        ? {
            max: parseIntR10(inputs.sentencesPerParagraphMax),
          }
        : {}),
    },
    //
    wordsPerSentence: {
      ...(inputs.wordsPerSentenceMin !== undefined
        ? {
            min: parseIntR10(inputs.wordsPerSentenceMin),
          }
        : {}),

      ...(inputs.wordsPerSentenceMax !== undefined
        ? {
            max: parseIntR10(inputs.wordsPerSentenceMax),
          }
        : {}),
    },
  };
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
app.get('/api/', async (req: { query: inputsType; body: inputsType }, res) => {
  const inputs = Object.keys(req.query).length !== 0 ? req.query : req.body;

  const { query, ...options } =
    inputs === req.query ? convertNumericQueryStringsToNumbers(inputs) : inputs;

  const article = await fullfiller(query, options);

  res.status(200).json(article);
});

// endpoint handles requests with route parameters (also known as path)
app.get(
  // {0,} means you can leave parameter empty while still being able to
  // declare subsequent parameters (https://github.com/expressjs/express/issues/2495)
  '/api/:query/:unit(\\w{0,})?/:quantity(\\d{0,})?/:format(\\w{0,})?/:sentencesPerParagraphMin(\\d{0,})?/:sentencesPerParagraphMax(\\d{0,})?/:wordsPerSentenceMin(\\d{0,})?/:wordsPerSentenceMax(\\d{0,})?',
  async (req: { params: flatInputsType }, res) => {
    const inputs = objectFilter(req.params, ([, v]) => v !== ''); // filter out empty inputs

    const { query, ...options } = {
      ...unflattenBreakdownOptions(inputs),

      ...(inputs.quantity !== undefined
        ? {
            quantity: parseIntR10(inputs.quantity),
          }
        : {}),
    };

    const article = await fullfiller(query, options);

    res.status(200).json(article);
  }
);

const PORT = process.env.PORT || 8888;

app.listen(
  PORT,
  () => console.log(`Server is running at http://localhost:${PORT}.`) // eslint-disable-line no-console
);
