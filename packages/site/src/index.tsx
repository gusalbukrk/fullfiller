import React from 'react';
import { createRoot } from 'react-dom/client';

import Form from './components/Form';

import './reset.css';
import './index.scss';

function App() {
  return (
    <>
      <h1>
        <span>full</span>filler
      </h1>
      <Form />
    </>
  );
}

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
