import config from '../../jest.config.js'; // eslint-disable-line import/extensions

config.projects[0].globals['ts-jest'].tsconfig = './tsconfig.json';

export default config;
