import { Logic } from './ActionStack';

describe('ActionStackLogic unit tests', () => {
  // Here are some reused objects
  let initialState, initialHistory, historyWith4Undos, historyWith4Redos;

  beforeEach(() => {
    initialState = { a: 'a', b: 13, c: true };

    initialHistory = Logic.createInitialHistory(initialState);

    let temp1 = initialHistory;
    let temp2 = Logic.onAction({ a: 'blab', b: 13, c: true })(temp1);
    let temp3 = Logic.onAction({ a: 'blab', b: 666, c: true })(temp2);
    let temp4 = Logic.onAction({ a: 'blab', b: -3, c: false })(temp3);
    historyWith4Undos = Logic.onAction({ a: 'blab', b: -3, c: true })(temp4);

    historyWith4Redos = Logic.onUndo(4)(historyWith4Undos);
  });

  test('createInitialHistory initializes complex history state', () => {
    const initialState = { a: 'a', b: 13, c: true };

    const initialHistory = Logic.createInitialHistory(initialState);

    expect(initialHistory).toStrictEqual({
      array: [{ a: 'a', b: 13, c: true }],
      historyIndex: 0,
    });
  });

  describe('actions', () => {
    describe('onAction', () => {
      describe('1st action', () => {
        let history1stStep;

        beforeAll(() => {
          history1stStep = Logic.onAction({ a: 'a', b: 14, c: true })(
            initialHistory
          );
        });

        test("new history's length is 2", () => {
          expect(history1stStep.array.length).toBe(2);
        });

        test("onAction is pure - doesn't mutate input history", () => {
          expect(initialHistory).toStrictEqual({
            array: [{ a: 'a', b: 13, c: true }],
            historyIndex: 0,
          });
        });

        test('history array contains diff for undo instead of full state', () => {
          expect(history1stStep).toStrictEqual({
            array: [{ b: 13 }, { a: 'a', b: 14, c: true }],
            historyIndex: 1,
          });
        });
      });

      test('multiple actions - undo diff is stored', () => {
        expect(historyWith4Undos).toStrictEqual({
          array: [
            { a: 'a' },
            { b: 13 },
            { b: 666, c: true },
            { c: false },
            { a: 'blab', b: -3, c: true },
          ],
          historyIndex: 4,
        });
      });

      test('nothing is changed, nothing is stored', () => {
        const history = Logic.onAction(initialState)(initialHistory);

        expect(history).toStrictEqual(initialHistory);
      });

      test('throw error when new state has different keys', () => {
        const expectedErrorMessage =
          'ActionStack.onAction received a new state that has different keys than the previous one.';

        expect(() =>
          Logic.onAction({ a: 'blab', b: 13 })(initialHistory)
        ).toThrowError(expectedErrorMessage);

        expect(() =>
          Logic.onAction({ a: 'blab', b: 13, c: true, d: false })(
            initialHistory
          )
        ).toThrowError(expectedErrorMessage);
      });
    });

    describe('onUndo/onRedo', () => {
      describe('onUndo', () => {
        test('redo diff is calculated, historyIndex points to current state', () => {
          let undoneHistory = Logic.onUndo()(historyWith4Undos);

          expect(undoneHistory).toStrictEqual({
            array: [
              { a: 'a' },
              { b: 13 },
              { b: 666, c: true },
              { a: 'blab', b: -3, c: false },
              { c: true },
            ],
            historyIndex: 3,
          });
        });

        test('multiple-step undo', () => {
          let totallyUndoneHistory = Logic.onUndo(4)(historyWith4Undos);

          expect(totallyUndoneHistory).toStrictEqual({
            array: [
              { a: 'a', b: 13, c: true },
              { a: 'blab' },
              { b: 666 },
              { b: -3, c: false },
              { c: true },
            ],
            historyIndex: 0,
          });
        });

        test('does nothing when there is nothing to undo', () => {
          const sameHistory = Logic.onUndo()(historyWith4Redos);
          expect(sameHistory).toStrictEqual(historyWith4Redos);
        });

        test('does nothing when undo step is too large', () => {
          const sameHistory = Logic.onUndo(5)(historyWith4Undos);
          expect(sameHistory).toStrictEqual(historyWith4Undos);
        });

        test('does nothing when undo step is too small', () => {
          let sameHistory = Logic.onUndo(0)(historyWith4Undos);
          expect(sameHistory).toStrictEqual(historyWith4Undos);

          sameHistory = Logic.onUndo(-1)(historyWith4Undos);
          expect(sameHistory).toStrictEqual(historyWith4Undos);
        });
      });

      describe('onRedo', () => {
        test('undo diff is calculated, historyIndex points to current state', () => {
          let redoneHistory = Logic.onRedo()(historyWith4Redos);

          expect(redoneHistory).toStrictEqual({
            array: [
              { a: 'a' },
              { a: 'blab', b: 13, c: true },
              { b: 666 },
              { b: -3, c: false },
              { c: true },
            ],
            historyIndex: 1,
          });
        });

        test('multiple-step redo', () => {
          let totallyRedoneHistory = Logic.onRedo(4)(historyWith4Redos);

          expect(totallyRedoneHistory).toStrictEqual({
            array: [
              { a: 'a' },
              { b: 13 },
              { b: 666, c: true },
              { c: false },
              { a: 'blab', b: -3, c: true },
            ],
            historyIndex: 4,
          });
        });

        test('does nothing when there is nothing to redo', () => {
          const sameHistory = Logic.onRedo()(historyWith4Undos);
          expect(sameHistory).toStrictEqual(historyWith4Undos);
        });

        test('does nothing when undo step is too large', () => {
          const sameHistory = Logic.onUndo(5)(historyWith4Redos);
          expect(sameHistory).toStrictEqual(historyWith4Redos);
        });

        test('does nothing when redo step is too small', () => {
          let sameHistory = Logic.onRedo(0)(historyWith4Redos);
          expect(sameHistory).toStrictEqual(historyWith4Redos);

          sameHistory = Logic.onRedo(-1)(historyWith4Redos);
          expect(sameHistory).toStrictEqual(historyWith4Redos);
        });
      });
    });
  });

  describe('helpers', () => {
    test('getCurrentState', () => {
      expect(Logic.getCurrentState(historyWith4Undos)).toStrictEqual(
        historyWith4Undos.array[4]
      );

      const undoneHistory = Logic.onUndo()(historyWith4Undos);
      expect(Logic.getCurrentState(undoneHistory)).toStrictEqual(
        undoneHistory.array[3]
      );
    });

    test('getNumberOfAvailableUndos', () => {
      expect(Logic.getNumberOfAvailableUndos(historyWith4Undos)).toBe(4);

      const historyWith3Undos = Logic.onUndo()(historyWith4Undos);
      expect(Logic.getNumberOfAvailableUndos(historyWith3Undos)).toBe(3);

      expect(Logic.getNumberOfAvailableUndos(historyWith4Redos)).toBe(0);
    });

    test('getNumberOfAvailableRedos', () => {
      expect(Logic.getNumberOfAvailableRedos(historyWith4Redos)).toBe(4);

      const historyWith3Redos = Logic.onRedo(2)(historyWith4Redos);
      expect(Logic.getNumberOfAvailableRedos(historyWith3Redos)).toBe(2);

      expect(Logic.getNumberOfAvailableRedos(historyWith4Undos)).toBe(0);
    });
  });
});
