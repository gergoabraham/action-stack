import React, { useState, useEffect } from 'react';

import './App.css';
import { useActionStack } from './ActionStack/ActionStack';

function App() {
  const { state, onAction, onUndo, isUndoAvailable } = useActionStack({
    dev: true,
    qa: true,
    prod: false,
  });

  const [draftState, setDraftState] = useState(null);

  useEffect(() => {
    setDraftState(state);
  }, [state]);

  return (
    <div className="App">
      <h1>ActionStack</h1>

      <h2>useActionStack hook</h2>
      <form id="form">
        <button type="button" onClick={onUndo} disabled={!isUndoAvailable}>
          Undo
        </button>

        {draftState &&
          Object.keys(draftState).map((attribute) => (
            <React.Fragment key={attribute}>
              <input
                type="checkbox"
                id={attribute}
                checked={draftState[attribute]}
                onChange={(event) =>
                  setDraftState((prev) => {
                    return { ...prev, [attribute]: event.target['checked'] };
                  })
                }
              />
              <label
                htmlFor={attribute}
                style={{
                  fontWeight:
                    draftState[attribute] !== state[attribute]
                      ? 'bold'
                      : 'normal',
                }}
              >
                {attribute}
              </label>
            </React.Fragment>
          ))}

        <button type="button" form="form" onClick={() => onAction(draftState)}>
          Save
        </button>
      </form>
    </div>
  );
}

export default App;
