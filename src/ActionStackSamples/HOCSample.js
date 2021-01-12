import { useState, useEffect } from 'react';

import { withActionStack } from '../ActionStack/ActionStack';
import StatelessForm from './StatelessForm';

function HOCSample({
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

export default withActionStack(HOCSample);
