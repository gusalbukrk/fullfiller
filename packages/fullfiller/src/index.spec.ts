import 'cross-fetch/polyfill';

import { inputType } from 'fullfiller-common/src/types';

import article from './article';

import fullfillerBase from '.';

const fullfiller = (input: inputType) => fullfillerBase(input);

describe('main function', () => {
  it.each([
    { type: 'query', input: 'lorem ipsum' },
    { type: 'text', input: article },
  ])(
    'returns correctly (input type: $type)',
    async ({ input }) => {
      expect.assertions(3);

      const output = await fullfiller(input);

      expect(Object.keys(output)).toHaveLength(2);
      expect(output.title).toBe('Lorem ipsum');
      expect(typeof output.body).toBe('string');
    },
    15000
  );
});
