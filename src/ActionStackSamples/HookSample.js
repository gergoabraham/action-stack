import { useActionStack } from '../ActionStack/ActionStack';
import UndoableForm from './UndoableForm';

function HookSample({ initialState, className }) {
  const props = useActionStack(initialState);

  return (
    <div className={className}>
      <h2>useActionStack hook example</h2>

      <UndoableForm formId="hook" {...props} />
    </div>
  );
}

export default HookSample;
