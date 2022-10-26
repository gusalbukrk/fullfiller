import React from 'react';
import ReactDOM from 'react-dom';

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

ReactDOM.render(<App />, document.getElementById('root'));
