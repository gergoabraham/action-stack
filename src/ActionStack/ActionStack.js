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

  const onUndo = () => {
    if (state.historyIndex > 0) {
      setState((state) => ({
        history: state.history,
        historyIndex: state.historyIndex - 1,
      }));
    }
  };

  const onRedo = () => {
    if (state.historyIndex < state.history.length - 1) {
      setState((state) => ({
        ...state,
        historyIndex: state.historyIndex + 1,
      }));
    }
  };

  return {
    state: state.history[state.historyIndex],
    onAction,
    onUndo,
    onRedo,
    isUndoAvailable: state.historyIndex > 0,
    isRedoAvailable: state.historyIndex < state.history.length - 1,
  };
}
