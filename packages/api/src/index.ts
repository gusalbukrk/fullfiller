import express from 'express';
import 'express-async-errors';
import fullfiller from 'fullfiller/src';
import {
  breakdownOptionType,
  optionsType,
  flatOptionsType,
} from 'fullfiller-common/src/types';
import {
  objectFilter,
  parseIntR10,
  unflattenBreakdownOptions,
} from 'fullfiller-common/src/utils';

import 'cross-fetch/dist/node-polyfill';

// for requests containing query parameters or body
type inputsType = { query: string } & optionsType;

// requests with route parameters doesn't support objects
// those requests may contain flat breakdown options which must be unflatten (converted to objects)
// before being passed to fullfiller function
// e.g. wordsPerSentenceMin => wordsPerSentence.min
type routeParamsInputsType = { query: string } & flatOptionsType;

// used for requests containing query parameters or x-www-form-urlencoded body
// parameters to be converted: quantity, sentencesPerParagraph and wordsPerSentence
function convertNumericParametersToNumbers(inputs: inputsType) {
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

const app = express();

// middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(express.static('../site/dist/'));
//
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// endpoint handles requests of 2 types:
// - requests with query parameters, e.g. `?query=harry potter&format=html`
// - requests with a body containing json or urlencoded data
app.get(
  '/api/',
  async (
    // express.Request<P, ResBody, ReqBody, ReqQuery, Locals extends Record<string, any>>
    req: express.Request<
      { [key: string]: string }, // default is ParamsDictionary, which has this exact interface
      unknown,
      inputsType,
      inputsType,
      Record<string, unknown>
    >,
    res
  ) => {
    const inputs = Object.keys(req.query).length !== 0 ? req.query : req.body;

    const { query, ...options } =
      // unlike json, query parameters and x-www-form-urlencoded bodies only support strings
      req.is('application/json') === 'json'
        ? inputs
        : convertNumericParametersToNumbers(inputs);

    const filler = await fullfiller(query, options);

    res.status(200).json(filler);
  }
);

// endpoint handles requests with route parameters (also known as path)
app.get(
  // {0,} = you can leave parameter empty while still being able to declare subsequent parameters
  '/api/:query/:unit(\\w{0,})?/:quantity(\\d{0,})?/:format(\\w{0,})?/:sentencesPerParagraphMin(\\d{0,})?/:sentencesPerParagraphMax(\\d{0,})?/:wordsPerSentenceMin(\\d{0,})?/:wordsPerSentenceMax(\\d{0,})?',
  async (req: { params: routeParamsInputsType }, res) => {
    const inputs = objectFilter(req.params, ([, v]) => v !== ''); // filter out empty inputs

    const { query, ...options } = {
      ...(unflattenBreakdownOptions(inputs) as inputsType),

      ...(inputs.quantity !== undefined
        ? {
            quantity: parseIntR10(inputs.quantity),
          }
        : {}),
    };

    const filler = await fullfiller(query, options);

    res.status(200).json(filler);
  }
);

const PORT = process.env.PORT || 80;

app.listen(
  PORT,
  () => console.log(`Server is running at http://localhost:${PORT}.`) // eslint-disable-line no-console
);
