import _ from 'lodash';

import ActionButton from '../components/ActionButton';
import Input from '../components/Input';

function StatelessForm({
  state,
  onAction,
  onUndo,
  onRedo,
  numberOfAvailableUndos,
  numberOfAvailableRedos,
  draftState,
  setDraftState,
}) {
  return (
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
  );
}

export default StatelessForm;
