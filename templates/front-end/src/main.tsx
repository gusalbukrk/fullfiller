import React from 'react';
import { createRoot } from 'react-dom/client';

import './reset.css';
import './index.scss';

import Header from './components/Header';
import Subheader from './components/Subheader';

function App() {
  return (
    <>
      <Header />
      <Subheader>for JavaScript Development</Subheader>
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
