import { useActionStack } from '../ActionStack/ActionStack';
import UndoableForm from './UndoableForm';

function HookSample({ initialState }) {
  const props = useActionStack(initialState);

  return (
    <div>
      <h2>useActionStack hook example</h2>

      <UndoableForm {...props} />
    </div>
  );
}

export default HookSample;
