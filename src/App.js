import React from 'react';

import './App.css';
import HookSample from './ActionStackSamples/HookSample';

function App({ initialState }) {
  return (
    <div className="App">
      <h1>ActionStack</h1>

      <HookSample initialState={initialState} />
    </div>
  );
}

export default App;
