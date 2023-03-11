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
// they may contain properties like wordsPerSentenceMin that must be converted to
// wordsPerSentence.min before being passed to fullfiller function
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

// handles breakdown options (i.e. sentencesPerParagraph and wordsPerSentence)
// for instance, convert wordsPerSentenceMin to wordsPerSentence.min
function unflattenBreakdownOptions(
  inputs: flatInputsType
): Partial<inputsType> {
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
app.get('/api/', async (req, res) => {
  const { query, ...options } = (
    Object.keys(req.query).length !== 0
      ? {
          // if request is using query parameters, need to convert breakdown options to objects
          // example: wordsPerSentenceMin => wordsPerSentence.min
          ...Object.fromEntries(
            // filter out breakdown options (e.g. wordsPerSentenceMin)
            Object.entries(req.query).filter(
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
          ),
          ...unflattenBreakdownOptions(req.query as unknown as flatInputsType),
        }
      : // if request is using body, breakdown options already are objects
        req.body
  ) as inputsType;

  if ('quantity' in options)
    options.quantity = parseIntRadix10(options.quantity as unknown as string);

  const article = await fullfiller(query, options);

  res.status(200).json(article);
});

// endpoint handles requests with route parameters (also known as path)
app.get(
  '/api/:query/:unit?/:quantity?/:format?/:sentencesPerParagraphMin?/:sentencesPerParagraphMax?/:wordsPerSentenceMin?/:wordsPerSentenceMax?',
  async (req: { params: flatInputsType }, res) => {
    const { params } = req;
    const { query } = params;

    const options: Omit<inputsType, 'query'> = {
      ...(params.unit !== undefined ? { unit: params.unit } : {}),
      ...(params.quantity !== undefined
        ? { quantity: parseIntRadix10(params.quantity as unknown as string) }
        : {}),
      ...(params.format !== undefined ? { format: params.format } : {}),
      ...unflattenBreakdownOptions(params),
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
