import React, { useState } from 'react';

import './ActionButton.css';

function ActionButton({ onClick, numberOfAvailableOperations, children }) {
  const [isMouseIn, setIsMouseIn] = useState(false);

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

      {numberOfAvailableOperations > 1 && isMouseIn && (
        <div className="additional-buttons">
          {new Array(numberOfAvailableOperations - 1).fill(0).map((x, i) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default ActionButton;
