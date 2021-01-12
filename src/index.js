import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const initialState = {
  dev: true,
  qa: true,
  prod: false,
  text: 'This is a text.',
  number: 13,
};

ReactDOM.render(
  <React.StrictMode>
    <App initialState={initialState} />
  </React.StrictMode>,
  document.getElementById('root')
);
