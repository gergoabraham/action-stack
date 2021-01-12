import React from 'react';

import { withActionStack } from '../ActionStack/ActionStack';
import UndoableForm from './UndoableForm';

class HOCSample extends React.Component {
  render() {
    return (
      <div>
        <h2>ActionStack HOC example</h2>

        <UndoableForm {...this.props} />
      </div>
    );
  }
}

export default withActionStack(HOCSample);
