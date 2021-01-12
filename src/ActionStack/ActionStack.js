import _ from 'lodash/array';
import { useState } from 'react';

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
    const previousState = history.array[history.historyIndex];

    Logic.assertNewState(newState, previousState);

    const diffForUndo = Logic.getDifferences(previousState, newState);

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

  static onUndo = (steps = 1) => (history) => {
    if (steps <= history.historyIndex) {
      let historyDraft = { ...history };

      for (let i = 0; i < steps; i++) {
        const currentState = historyDraft.array[historyDraft.historyIndex];
        const previousState = {
          ...currentState,
          ...historyDraft.array[historyDraft.historyIndex - 1],
        };
        const diffForRedo = Logic.getDifferences(currentState, previousState);

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

  static onRedo = (steps = 1) => (history) => {
    if (steps <= history.array.length - 1 - history.historyIndex) {
      let historyDraft = { ...history };
      for (let i = 0; i < steps; i++) {
        const nextState = {
          ...historyDraft.array[historyDraft.historyIndex],
          ...historyDraft.array[historyDraft.historyIndex + 1],
        };
        const diffForUndo = Logic.getDifferences(
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

  static getDifferences = (object, referenceObject) => {
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

  static assertNewState = (newState, previousState) => {
    const newKeys = Object.keys(newState);
    const previousKeys = Object.keys(previousState);

    if (
      _.difference(newKeys, previousKeys).length ||
      _.difference(previousKeys, newKeys).length
    ) {
      throw new Error(
        'ActionStack.onAction received a new state that has different keys than the previous one.'
      );
    }
  };
}
