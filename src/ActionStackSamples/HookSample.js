import { useState, useEffect } from 'react';

import { useActionStack } from '../ActionStack/ActionStack';
import StatelessForm from './StatelessForm';

function HookSample({ initialState }) {
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
    <div>
      <h2>useActionStack hook example</h2>

      <StatelessForm
        state={state}
        onAction={onAction}
        onUndo={onUndo}
        onRedo={onRedo}
        numberOfAvailableUndos={numberOfAvailableUndos}
        numberOfAvailableRedos={numberOfAvailableRedos}
        draftState={draftState}
        onDraftChange={(change) =>
          setDraftState((prev) => ({ ...prev, ...change }))
        }
      />
    </div>
  );
}

export default HookSample;
