import { useActionStackContext } from '../ActionStack/ActionStack';
import UndoableForm from './UndoableForm';

function ProviderSampleConsumer(props) {
  const actionStackProps = useActionStackContext();

  return <UndoableForm {...props} {...actionStackProps} />;
}

export default ProviderSampleConsumer;
