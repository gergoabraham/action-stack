import _ from 'lodash';
import { useState } from 'react';

export function useActionStack(initialState) {
  const [history, setHistory] = useState(createInitialHistory(initialState));

  const numberOfAvailableUndos = history.historyIndex;
  const numberOfAvailableRedos = Math.max(
    history.array.length - 1 - history.historyIndex,
    0
  );

  return {
    state: history.array[history.historyIndex],
    onAction: (newState) => setHistory(onAction(newState)),
    onUndo: (steps) => setHistory(onUndo(steps)),
    onRedo: (steps) => setHistory(onRedo(steps)),
    isUndoAvailable: numberOfAvailableUndos > 0,
    isRedoAvailable: numberOfAvailableRedos > 0,
    numberOfAvailableUndos,
    numberOfAvailableRedos,
  };
}

const createInitialHistory = (initialState) => ({
  array: [initialState],
  historyIndex: 0,
});

const onAction = (newState) => (history) => {
  const previousState = history.array[history.historyIndex];
  const diffForUndo = getDifferences(previousState, newState);

  if (Object.keys(diffForUndo).length > 0) {
    return {
      array: [
        ...history.array.slice(0, history.historyIndex),
        diffForUndo,
        newState,
      ],
      historyIndex: history.historyIndex + 1,
    };
  } else {
    return history;
  }
};

const onUndo = (steps = 1) => (history) => {
  if (steps <= history.historyIndex) {
    let historyDraft = { ...history };

    for (let i = 0; i < steps; i++) {
      const currentState = historyDraft.array[historyDraft.historyIndex];
      const previousState = {
        ...currentState,
        ...historyDraft.array[historyDraft.historyIndex - 1],
      };
      const diffForRedo = getDifferences(currentState, previousState);

      historyDraft = {
        array: [
          ...historyDraft.array.slice(0, historyDraft.historyIndex - 1),
          previousState,
          diffForRedo,
          ...historyDraft.array.slice(historyDraft.historyIndex + 1),
        ],
        historyIndex: historyDraft.historyIndex - 1,
      };
    }

    return historyDraft;
  } else {
    return history;
  }
};

const onRedo = (steps = 1) => (history) => {
  if (steps <= history.array.length - 1 - history.historyIndex) {
    let historyDraft = { ...history };

    for (let i = 0; i < steps; i++) {
      const nextState = {
        ...historyDraft.array[historyDraft.historyIndex],
        ...historyDraft.array[historyDraft.historyIndex + 1],
      };
      const diffForUndo = getDifferences(
        historyDraft.array[historyDraft.historyIndex],
        nextState
      );

      historyDraft = {
        array: [
          ...historyDraft.array.slice(0, historyDraft.historyIndex),
          diffForUndo,
          nextState,
          ...historyDraft.array.slice(historyDraft.historyIndex + 2),
        ],
        historyIndex: historyDraft.historyIndex + 1,
      };
    }
    return historyDraft;
  } else {
    return history;
  }
};

const getDifferences = (object, referenceObject) => {
  const differences = {};

  for (const key in referenceObject) {
    if (Object.hasOwnProperty.call(referenceObject, key)) {
      if (referenceObject[key] !== object[key]) {
        differences[key] = object[key];
      }
    }
  }
  return differences;
};
