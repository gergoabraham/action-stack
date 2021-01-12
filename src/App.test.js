import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('E2E tests', () => {
  const initialState = {
    a: true,
    b: 'text',
    c: 13,
  };

  let checkboxElem, textInput, numberInput, saveButton, undoButton, redoButton;

  beforeEach(() => {
    render(<App initialState={initialState} />);

    checkboxElem = screen.getByLabelText('a:');
    textInput = screen.getByLabelText('b:');
    numberInput = screen.getByLabelText('c:');

    saveButton = screen.getByText('Save');
    undoButton = screen.getByText('Undo');
    redoButton = screen.getByText('Redo');
  });

  test('initial state is the given one, buttons are disabled', () => {
    assertState();
  });

  test('Save button is enabled when checkbox is changed', async () => {
    fireEvent.click(checkboxElem);

    assertState({ checkbox: false, save: true });
  });

  test('Save button is enabled when number is changed', async () => {
    fireEvent.change(numberInput, { target: { value: 14 } });

    assertState({ number: 14, save: true });
  });

  test('Save button is enabled when text is changed', async () => {
    fireEvent.change(textInput, { target: { value: 'another text' } });

    assertState({ text: 'another text', save: true });
  });

  test('Undo button is enabled when changes are saved', async () => {
    fireEvent.change(textInput, { target: { value: 'another text' } });

    fireEvent.click(saveButton);

    assertState({ text: 'another text', undo: 1 });
  });

  test('Undo button has a dropdown when there are multiple undo buttons', async () => {
    const actualState = save3Actions();

    assertState({ ...actualState, undo: 3 });
  });

  test('Undo works, enables redo button', async () => {
    const actualState = save3Actions();

    fireEvent.click(undoButton);

    assertState({ ...actualState, checkbox: false, undo: 2, redo: 1 });
  });

  test('Multiple undo works, redo has a dropdown', async () => {
    save3Actions();

    fireEvent.mouseEnter(undoButton);
    fireEvent.click(screen.queryByText('3 steps'));

    assertState({ redo: 3 });
  });

  test('Multiple redo works', async () => {
    const latestState = save3Actions();

    fireEvent.mouseEnter(undoButton);
    fireEvent.click(screen.queryByText('3 steps'));

    fireEvent.mouseEnter(redoButton);
    fireEvent.click(screen.getByText('3 steps'));

    assertState({ ...latestState, undo: 3 });
  });

  test('Saving a new state clears redo', async () => {
    save3Actions();

    fireEvent.mouseEnter(undoButton);
    fireEvent.click(screen.queryByText('3 steps'));

    fireEvent.click(checkboxElem);
    fireEvent.click(saveButton);

    assertState({ checkbox: false, undo: 1 });
  });

  function assertState({
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
    assertActionButton(undo, undoButton);
    assertActionButton(redo, redoButton);
  }

  function assertButton(enabled, button) {
    enabled
      ? expect(button).not.toHaveAttribute('disabled')
      : expect(button).toHaveAttribute('disabled');
  }

  function assertActionButton(num, button) {
    assertButton(num, button);
    assertActionButtonDropdown(num, button);
  }

  function assertActionButtonDropdown(num, button) {
    if (num > 1) {
      expect(screen.queryByText(`${num} steps`)).not.toBeInTheDocument();
      expect(screen.queryByText(`${num + 1} steps`)).not.toBeInTheDocument();

      fireEvent.mouseEnter(button);

      expect(screen.queryByText(`${num} steps`)).toBeInTheDocument();
      expect(screen.queryByText(`${num + 1} steps`)).not.toBeInTheDocument();
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
});
