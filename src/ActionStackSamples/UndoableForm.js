import _ from 'lodash';
import { useState, useEffect } from 'react';

import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import './UndoableForm.css';

function UndoableForm({
  state,
  onAction,
  onUndo,
  onRedo,
  numberOfAvailableUndos,
  numberOfAvailableRedos,
}) {
  const [draftState, setDraftState] = useState(null);

  useEffect(() => {
    setDraftState(state);
  }, [state]);

  return (
    <form className="undoable-form">
      {draftState &&
        Object.keys(draftState).map((key) => (
          <Input
            key={key}
            name={key}
            value={draftState[key]}
            onChange={(value) =>
              setDraftState((draft) => ({ ...draft, [key]: value }))
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
  );
}

export default UndoableForm;
