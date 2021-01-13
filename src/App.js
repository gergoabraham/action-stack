import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

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

  const transitionProps = {
    timeout: 550,
    classNames: 'fade-in',
    mountOnEnter: true,
  };

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

      <div className="sample-container">
        <CSSTransition in={sample === 'hook'} {...transitionProps}>
          <HookSample className="sample" initialState={initialState} />
        </CSSTransition>

        <CSSTransition in={sample === 'hoc'} {...transitionProps}>
          <HOCSample className="sample" initialState={initialState} />
        </CSSTransition>

        <CSSTransition in={sample === 'provider'} {...transitionProps}>
          <ProviderSample className="sample" initialState={initialState} />
        </CSSTransition>
      </div>
    </div>
  );
}

export default App;
