import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HookSample from './HookSample';
import HOCSample from './HOCSample';
import ProviderSample from './ProviderSample';

// eslint-disable-next-line jest/valid-describe
describe('Integration tests for Hook', e2eTestFor(HookSample));

// eslint-disable-next-line jest/valid-describe
describe('Integration tests for HOC', e2eTestFor(HOCSample));

// eslint-disable-next-line jest/valid-describe
describe('Integration tests for Provider', e2eTestFor(ProviderSample));

function e2eTestFor(SampleUnderTest) {
  return () => {
    const initialState = {
      a: true,
      b: 'text',
      c: 13,
    };

    let checkboxElem,
      textInput,
      numberInput,
      saveButton,
      undoButton,
      redoButton;

    beforeEach(() => {
      render(<SampleUnderTest initialState={initialState} />);

      checkboxElem = screen.getAllByLabelText('a:')[0];
      textInput = screen.getAllByLabelText('b:')[0];
      numberInput = screen.getAllByLabelText('c:')[0];

      saveButton = screen.getAllByText('Save')[0];
      undoButton = screen.getAllByText('Undo')[0];
      redoButton = screen.getAllByText('Redo')[0];
    });

    test('initial state is the given one, buttons are disabled', async () => {
      await assertState();
    });

    test('Save button is enabled when checkbox is changed', async () => {
      fireEvent.click(checkboxElem);

      await assertState({ checkbox: false, save: true });
    });

    test('Save button is enabled when number is changed', async () => {
      fireEvent.change(numberInput, { target: { value: 14 } });

      await assertState({ number: 14, save: true });
    });

    test('Save button is enabled when text is changed', async () => {
      fireEvent.change(textInput, { target: { value: 'another text' } });

      await assertState({ text: 'another text', save: true });
    });

    test('Undo button is enabled when changes are saved', async () => {
      fireEvent.change(textInput, { target: { value: 'another text' } });

      fireEvent.click(saveButton);

      await assertState({ text: 'another text', undo: 1 });
    });

    test('Undo button has a dropdown when there are multiple undo buttons', async () => {
      const actualState = save3Actions();

      await assertState({ ...actualState, undo: 3 });
    });

    test('Undo works, enables redo button', async () => {
      const actualState = save3Actions();

      fireEvent.click(undoButton);

      await assertState({ ...actualState, checkbox: false, undo: 2, redo: 1 });
    });

    test('Multiple undo works, redo has a dropdown', async () => {
      save3Actions();

      fireEvent.mouseEnter(undoButton);
      fireEvent.click(screen.queryByText('3 steps'));

      await assertState({ redo: 3 });
    });

    test('Multiple redo works', async () => {
      const latestState = save3Actions();

      fireEvent.mouseEnter(undoButton);
      fireEvent.click(screen.queryByText('3 steps'));

      fireEvent.mouseEnter(redoButton);
      fireEvent.click(screen.getByText('3 steps'));

      await assertState({ ...latestState, undo: 3 });
    });

    test('Saving a new state clears redo', async () => {
      save3Actions();

      fireEvent.mouseEnter(undoButton);
      fireEvent.click(screen.queryByText('3 steps'));

      fireEvent.click(checkboxElem);
      fireEvent.click(saveButton);

      await assertState({ checkbox: false, undo: 1 });
    });

    async function assertState({
      checkbox = initialState.a,
      text = initialState.b,
      number = initialState.c,
      save = false,
      undo = 0,
      redo = 0,
    } = {}) {
      checkbox
        ? expect(checkboxElem).toBeChecked()
        : expect(checkboxElem).not.toBeChecked();
      expect(textInput).toHaveValue(text);
      expect(numberInput).toHaveValue(number);

      assertButton(save, saveButton);
      await assertActionButton(undo, undoButton);
      await assertActionButton(redo, redoButton);
    }

    function assertButton(enabled, button) {
      enabled
        ? expect(button).not.toHaveAttribute('disabled')
        : expect(button).toHaveAttribute('disabled');
    }

    async function assertActionButton(num, button) {
      assertButton(num, button);
      await assertActionButtonDropdown(num, button);
    }

    async function assertActionButtonDropdown(num, button) {
      if (num > 1) {
        // we need to wait until CSS transitions are done
        await waitFor(() => {
          expect(screen.queryByText(`${num} steps`)).not.toBeInTheDocument();
          expect(
            screen.queryByText(`${num + 1} steps`)
          ).not.toBeInTheDocument();
        });

        fireEvent.mouseEnter(button);

        await waitFor(() => {
          expect(screen.queryByText(`${num} steps`)).toBeInTheDocument();
          expect(
            screen.queryByText(`${num + 1} steps`)
          ).not.toBeInTheDocument();
        });
      }
    }

    function save3Actions() {
      fireEvent.change(textInput, { target: { value: 'another text' } });
      fireEvent.click(saveButton);
      fireEvent.click(checkboxElem);
      fireEvent.click(saveButton);
      fireEvent.click(checkboxElem);
      fireEvent.click(saveButton);

      return { text: 'another text' };
    }
  };
}
