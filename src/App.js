import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import './App.css';
import { useActionStack } from './ActionStack/ActionStack';
import ActionButton from './components/ActionButton';
import Input from './components/Input';

function App({ initialState }) {
  const {
    state,
    onAction,
    onUndo,
    onRedo,
    numberOfAvailableUndos,
    numberOfAvailableRedos,
  } = useActionStack(initialState);

  const [draftState, setDraftState] = useState(null);

  useEffect(() => {
    setDraftState(state);
  }, [state]);

  return (
    <div className="App">
      <h1>ActionStack</h1>

      <h2>useActionStack hook</h2>
      <form>
        {draftState &&
          Object.keys(draftState).map((key) => (
            <Input
              key={key}
              name={key}
              value={draftState[key]}
              onChange={(value) =>
                setDraftState((prev) => ({ ...prev, [key]: value }))
              }
              referenceValue={state[key]}
            />
          ))}

        <div className="button-container">
          <ActionButton
            numberOfAvailableOperations={numberOfAvailableUndos}
            onClick={onUndo}
          >
            Undo
          </ActionButton>

          <ActionButton
            numberOfAvailableOperations={numberOfAvailableRedos}
            onClick={onRedo}
          >
            Redo
          </ActionButton>

          <button
            type="button"
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
