import _ from 'lodash/array';
import { useState, createContext, useContext } from 'react';

// --- Hook --------------------------------------------------------------------
export function useActionStack(initialState) {
  const [history, setHistory] = useState(
    Logic.createInitialHistory(initialState)
  );

  return {
    state: Logic.getCurrentState(history),
    onAction: (newState) => setHistory(Logic.onAction(newState)),
    onUndo: (steps) => setHistory(Logic.onUndo(steps)),
    onRedo: (steps) => setHistory(Logic.onRedo(steps)),
    numberOfAvailableUndos: Logic.getNumberOfAvailableUndos(history),
    numberOfAvailableRedos: Logic.getNumberOfAvailableRedos(history),
  };
}

// --- HOC ---------------------------------------------------------------------
export const withActionStack = (WrappedComponent) => ({
  initialState,
  ...props
}) => {
  const actionStackHookProps = useActionStack(initialState);

  return <WrappedComponent {...props} {...actionStackHookProps} />;
};

// --- Provider ----------------------------------------------------------------
export const ActionStackContext = createContext(null);

export function useActionStackContext() {
  return useContext(ActionStackContext);
}

export function ActionStackProvider({ initialState, children }) {
  const props = useActionStack(initialState);

  return (
    <ActionStackContext.Provider value={props}>
      {children}
    </ActionStackContext.Provider>
  );
}

// --- Business logic, exported for tests --------------------------------------
export class Logic {
  static createInitialHistory = (initialState) => ({
    array: [initialState],
    historyIndex: 0,
  });

  static getCurrentState = (history) => history.array[history.historyIndex];

  static getNumberOfAvailableUndos = (history) => history.historyIndex;

  static getNumberOfAvailableRedos = (history) =>
    Math.max(history.array.length - 1 - history.historyIndex, 0);

  static onAction = (newState) => (history) => {
    const previousState = Logic.getCurrentState(history);
    Logic.#assertKeysInNewState(newState, previousState);

    const diffForUndo = Logic.#getDifferences(previousState, newState);
    const hasStateChanged = Object.keys(diffForUndo).length > 0;

    if (hasStateChanged) {
      const earlierUndoDiffs = history.array.slice(0, history.historyIndex);
      return {
        array: [...earlierUndoDiffs, diffForUndo, newState],
        historyIndex: history.historyIndex + 1,
      };
    } else {
      return history;
    }
  };

  static #assertKeysInNewState = (newState, previousState) => {
    const newKeys = Object.keys(newState);
    const previousKeys = Object.keys(previousState);

    if (
      _.difference(newKeys, previousKeys).length ||
      _.difference(previousKeys, newKeys).length
    ) {
      throw new Error(
        'ActionStack.onAction received a new state ' +
          'that has different keys than the previous one.'
      );
    }
  };

  static onUndo = (steps = 1) => (history) => {
    if (steps <= history.historyIndex) {
      let historyDraft = { ...history };

      for (let i = 0; i < steps; i++) {
        historyDraft = Logic.#undoOneStep(historyDraft);
      }

      return historyDraft;
    } else {
      return history;
    }
  };

  static #undoOneStep = (history) => {
    const currentState = Logic.getCurrentState(history);
    const previousState = {
      ...currentState,
      ...history.array[history.historyIndex - 1],
    };

    const diffForRedo = Logic.#getDifferences(currentState, previousState);
    const earlierUndoDiffs = history.array.slice(0, history.historyIndex - 1);
    const laterRedoDiffs = history.array.slice(history.historyIndex + 1);

    return {
      array: [
        ...earlierUndoDiffs,
        previousState,
        diffForRedo,
        ...laterRedoDiffs,
      ],
      historyIndex: history.historyIndex - 1,
    };
  };

  static onRedo = (steps = 1) => (history) => {
    if (steps <= history.array.length - 1 - history.historyIndex) {
      let historyDraft = { ...history };

      for (let i = 0; i < steps; i++) {
        historyDraft = Logic.#redoOneStep(historyDraft);
      }

      return historyDraft;
    } else {
      return history;
    }
  };

  static #redoOneStep = (history) => {
    const currentState = Logic.getCurrentState(history);
    const nextState = {
      ...currentState,
      ...history.array[history.historyIndex + 1],
    };

    const diffForUndo = Logic.#getDifferences(currentState, nextState);
    const earlierUndoDiffs = history.array.slice(0, history.historyIndex);
    const laterRedoDiffs = history.array.slice(history.historyIndex + 2);

    return {
      array: [...earlierUndoDiffs, diffForUndo, nextState, ...laterRedoDiffs],
      historyIndex: history.historyIndex + 1,
    };
  };

  static #getDifferences = (object, referenceObject) => {
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
}
