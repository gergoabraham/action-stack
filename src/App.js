import React, { useState } from 'react';

import './App.css';
import HookSample from './ActionStackSamples/HookSample';
import HOCSample from './ActionStackSamples/HOCSample';
import ProviderSample from './ActionStackSamples/ProviderSample';

const initialState = {
  dev: true,
  qa: true,
  prod: false,
  text: 'This is a text.',
  number: 13,
};

function App() {
  const [sample, setSample] = useState('hook');

  return (
    <div className="App">
      <h1>ActionStack</h1>

      <form className="example-selector">
        <button type="button" onClick={() => setSample('hook')}>
          Hook
        </button>
        <button type="button" onClick={() => setSample('hoc')}>
          HOC
        </button>
        <button type="button" onClick={() => setSample('provider')}>
          Provider
        </button>
      </form>

      {sample === 'hook' && <HookSample initialState={initialState} />}
      {sample === 'hoc' && <HOCSample initialState={initialState} />}
      {sample === 'provider' && <ProviderSample initialState={initialState} />}
    </div>
  );
}

export default App;
