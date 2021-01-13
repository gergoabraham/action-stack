import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import './ActionButton.css';

function ActionButton({ onClick, numberOfAvailableOperations, children }) {
  const [isMouseIn, setIsMouseIn] = useState(false);

  const additionalButtonCount = Math.max(0, numberOfAvailableOperations - 1);
  const additionalButtonArray = new Array(additionalButtonCount)
    .fill(0)
    .map((x, i) => (
      <button
        type="button"
        key={i + 2}
        onClick={() => {
          setIsMouseIn(false);
          onClick(i + 2);
        }}
      >
        {i + 2} steps
      </button>
    ));

  return (
    <div className="action-button" onMouseLeave={() => setIsMouseIn(false)}>
      <button
        type="button"
        onClick={() => onClick()}
        onMouseEnter={() => setIsMouseIn(true)}
        disabled={numberOfAvailableOperations === 0}
      >
        {children}
      </button>

      <CSSTransition
        in={numberOfAvailableOperations > 1 && isMouseIn}
        classNames="fade-in"
        mountOnEnter
        unmountOnExit
        timeout={300}
      >
        <div
          className="additional-buttons"
          onMouseEnter={() => setIsMouseIn(true)}
        >
          {additionalButtonArray}
        </div>
      </CSSTransition>
    </div>
  );
}

export default ActionButton;
