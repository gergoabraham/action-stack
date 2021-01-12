import React from 'react';

import './App.css';
import HookSample from './ActionStackSamples/HookSample';
import HOCSample from './ActionStackSamples/HOCSample';

const initialState = {
  dev: true,
  qa: true,
  prod: false,
  text: 'This is a text.',
  number: 13,
};

function App() {
  return (
    <div className="App">
      <h1>ActionStack</h1>

      <HookSample initialState={initialState} />
      <HOCSample initialState={initialState} />
    </div>
  );
}

export default App;
