import { useState } from 'react';

export function useActionStack(initialState) {
  const [state, setState] = useState({
    history: [initialState],
    historyIndex: 0,
  });

  const onAction = (newState) => {
    setState((state) => ({
      history: [...state.history.slice(0, state.historyIndex + 1), newState],
      historyIndex: state.historyIndex + 1,
    }));
  };

  const onUndo = (steps = 1) => {
    if (steps <= state.historyIndex) {
      setState((state) => ({
        history: state.history,
        historyIndex: state.historyIndex - steps,
      }));
    }
  };

  const onRedo = (steps = 1) => {
    if (steps <= state.history.length - 1 - state.historyIndex) {
      setState((state) => ({
        ...state,
        historyIndex: state.historyIndex + steps,
      }));
    }
  };

  const numberOfAvailableUndo = state.historyIndex;
  const numberOfAvailableRedo = Math.max(
    state.history.length - 1 - state.historyIndex,
    0
  );

  return {
    state: state.history[state.historyIndex],
    onAction,
    onUndo,
    onRedo,
    isUndoAvailable: numberOfAvailableUndo > 0,
    isRedoAvailable: numberOfAvailableRedo > 0,
    numberOfAvailableUndo,
    numberOfAvailableRedo,
  };
}
