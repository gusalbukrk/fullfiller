import React from 'react'; // eslint-disable-line no-unused-vars
import renderer from 'react-test-renderer';

import Subheader from './Subheader.js';

describe('renders correctly', () => {
  it('header', () => {
    expect.assertions(3);

    const tree = renderer.create(<Subheader>...</Subheader>).toJSON();

    expect(tree.type).toBe('h2');
    expect(tree.props.className).toBeTruthy();
    expect(tree.children[0]).toBe('...');
  });
});
