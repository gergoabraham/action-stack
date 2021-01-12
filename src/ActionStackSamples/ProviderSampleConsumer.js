import { useActionStackContext } from '../ActionStack/ActionStack';
import UndoableForm from './UndoableForm';

function ProviderSampleConsumer() {
  const props = useActionStackContext();

  return <UndoableForm {...props} />;
}

export default ProviderSampleConsumer;
