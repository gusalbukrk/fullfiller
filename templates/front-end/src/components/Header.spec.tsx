import renderer from 'react-test-renderer';

import Header from './Header';

describe('header', () => {
  it('renders correctly', () => {
    expect.assertions(1);

    const tree = renderer.create(<Header />).toJSON() as { children: string[] };

    expect(tree.children[0]).toBe('Starter');
  });
});
