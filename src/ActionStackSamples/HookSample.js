import { useState, useEffect } from 'react';

import { useActionStack } from '../ActionStack/ActionStack';
import StatelessForm from './StatelessForm';

function HookSample({ initialState }) {
  const props = useActionStack(initialState);

  const [draftState, setDraftState] = useState(null);

  useEffect(() => {
    setDraftState(props.state);
  }, [props.state]);

  return (
    <div>
      <h2>useActionStack hook</h2>

      <StatelessForm
        {...props}
        draftState={draftState}
        setDraftState={setDraftState}
      />
    </div>
  );
}

export default HookSample;
