import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import './App.css';
import { useActionStack } from './ActionStack/ActionStack';
import ActionButton from './ActionButton/ActionButton';

function App() {
  const {
    state,
    onAction,
    onUndo,
    onRedo,
    numberOfAvailableUndo,
    numberOfAvailableRedo,
  } = useActionStack({
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

        <div className="button-container">
          <ActionButton
            numberOfAvailableOperations={numberOfAvailableUndo}
            onClick={onUndo}
          >
            Undo
          </ActionButton>

          <ActionButton
            numberOfAvailableOperations={numberOfAvailableRedo}
            onClick={onRedo}
          >
            Redo
          </ActionButton>

          <button
            type="button"
            form="form"
            onClick={() => onAction(draftState)}
            disabled={_.isEqual(draftState, state)}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
