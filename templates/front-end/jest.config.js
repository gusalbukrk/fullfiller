import config from '../../jest.config.js'; // eslint-disable-line import/extensions

config.projects[0].moduleNameMapper = {
  '\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/fileMock.js',
  '\\.(css|s[ac]ss)$': 'identity-obj-proxy',
};

config.projects[0].transform['^.+\\.tsx?$'][1].tsconfig =
  './tsconfig.jest.json';

export default config;
