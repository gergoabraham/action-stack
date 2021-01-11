import { useState } from 'react';

export function useActionStack(initialState) {
  const [state, setState] = useState({
    currentState: initialState,
    history: [],
  });

  const onAction = (newState) => {
    setState((state) => ({
      ...state,
      history: [...state.history, state.currentState],
      currentState: newState,
    }));
  };

  const onUndo = () => {
    if (state.history.length) {
      setState((state) => ({
        ...state,
        history: state.history.slice(0, -1),
        currentState: state.history[state.history.length - 1],
      }));
    }
  };

  return {
    state: state.currentState,
    onAction,
    onUndo,
    isUndoAvailable: !!state.history.length,
  };
}
