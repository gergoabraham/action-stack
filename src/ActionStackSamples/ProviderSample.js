import {
  ActionStackProvider,
  ActionStackContext,
} from '../ActionStack/ActionStack';
import ProviderSampleConsumer from './ProviderSampleConsumer';
import UndoableForm from './UndoableForm';

function ProviderSample({ initialState }) {
  return (
    <div>
      <h2>ActionStack Provider example</h2>

      <ActionStackProvider initialState={initialState}>
        <ActionStackContext.Consumer>
          {(props) => <UndoableForm {...props} formId="consumer" />}
        </ActionStackContext.Consumer>

        <h3>Same context:</h3>
        <ProviderSampleConsumer />
      </ActionStackProvider>
    </div>
  );
}

export default ProviderSample;
