import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Form from './components/Form';

import './reset.css';
import './index.scss';

function App() {
  return (
    <>
      <header>
        <h1>
          <a href="/">
            <span>full</span>filler
          </a>
        </h1>
        <i>
          <a
            href="https://github.com/gusalbukrk/fullfiller"
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon id="generate-icon" icon={faGithub as IconProp} />
          </a>
        </i>
      </header>
      <Form />
    </>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

export default App;
