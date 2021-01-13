import {
  ActionStackProvider,
  ActionStackContext,
} from '../ActionStack/ActionStack';
import ProviderSampleConsumer from './ProviderSampleConsumer';
import UndoableForm from './UndoableForm';

function ProviderSample({ initialState, className }) {
  return (
    <div className={className}>
      <h2>ActionStack Provider example</h2>

      <ActionStackProvider initialState={initialState}>
        <ActionStackContext.Consumer>
          {(props) => <UndoableForm {...props} formId="provider-1" />}
        </ActionStackContext.Consumer>

        <h3>Same context:</h3>
        <ProviderSampleConsumer formId="provider-2" />
      </ActionStackProvider>
    </div>
  );
}

export default ProviderSample;
