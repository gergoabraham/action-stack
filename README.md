# ActionStack

The goal of this exercise was to implement a helper that is able to track changes (actions) in a space-efficient way, and undo/redo them.

[Click here to see it in action!](https://gergooo.github.io/action-stack/)

## Functionality

### Interface

`ActionStack` provides a lot of props to its users. First, there is `state`, that can be initialized with an object, that can only contain primitive `numbers`, `strings` and `booleans`. This `state` can be used as the client component's inner state.

`onAction(newState)` is a callback, that should be called when the client wants to update its state. The input value must have the same keys as the current state.

`onUndo(steps?)` and `onRedo(steps?)` are used to undo or redo the last actions. `steps` is an optional parameter to indicate how many actions we want to undo/redo. On default it is `1`.

`numberOfAvailableUndos` and `numberOfAvailableRedos` give the number of available undo/redo operations, they are always greater than or equal to zero.

### Usage

`ActionStack` can be used in 3 ways. You can see the examples in the `ActionStackSamples` folder.

#### Hook

`useActionStack` is a hook for function components:

```javascript
import { useActionStack } from '../ActionStack/ActionStack';
...
const props = useActionStack(initialState);
```

Here, `props` will contain `state`, `onAction` and the other props.

#### Higher-order component

`withActionStack` is a higher-order component for both function and class components:

```javascript
import { withActionStack } from '../ActionStack/ActionStack';
...
export default withActionStack(MyComponent);
```

`MyComponent` will receive all the `props`.

#### Provider

`ActionStackProvider` can be used either in pair with its `ActionStackContext` or with the `useActionStackContext` hook.

`ParentComponent.js`:

```javascript
import { ActionStackProvider } from '../ActionStack/ActionStack';
...
<ActionStackProvider initialState={initialState}>
  { /* consumer components come here */ }
</ActionStackProvider>
```

`Consumer1.js`:

```javascript
import { ActionStackContext } from '../ActionStack/ActionStack';
...
<ActionStackContext.Consumer>
  {(props) => <MyComponent {...props}/>}
</ActionStackContext.Consumer>
```

`Consumer2.js`:

```javascript
import { useActionStackContext } from '../ActionStack/ActionStack';
...
const props = useActionStackContext();
```

## Implementation

### Logic

`ActionStack`'s `Logic` class contains all the business logic as pure functions. All of them receives one or more parameters that won't be mutated, and returns with the new history (or other desired return values).

The `useActionStack` hook wraps this `Logic` and combines it with the `useState` hook. The higher-order component and the Provider wraps the `useActionStack` hook itself.

#### Space-efficiency

The history consists of an `array` and a `historyIndex`. `historyIndex` points to the current state in the `array`, which describes the full state including all of its properties.

Before and after the current state are the undo and redo differences, if there are any. There, only the differences are stored compared to the adjacent state.

```javascript
{
  array: [
    {prevA                    }, // here are 3 undo diffs
    {       prevB, prevC      },
    {prevA                    },
    {    a,     b,     c,    d}, // this is the current state
    {       nextB             },
    {                    nextD}, // and these were 2 redo diffs
  ],
  historyIndex: 3;
}
```

As mentioned, the differences are calculated compared to the adjacent state. In other words, in the above example to go back from the 4th (current) state to the 2nd state, all of `prevA` from the 3rd state diff, and `prevB` and `prevC` from the 2nd state diff should be applied, similarly to the _incremental backup strategy_. Afterwards the new state and the new diffs are stored in the array.

### Implementation, tests

As you can see from the commit log, I've implemented this starting with the hook version, adding features one-by-one, supporting with a UI and manual testing. After all features were added, I've optimized the history to store only the diffs, unfortunately still without automated tests.

Afterwards I've extracted the business logic from the hook, in order to a) make it simple to write unit tests, b) I had it in mind that I will use the same functions in the HOC and Provider versions. Regarding b), I was wrong, because the HOC and the Provider uses the hook itself. Regarding a), it would have been nicer to first write the high-level tests that support this kind of refactoring.

So there was no stopping from here, unit tests for checking the inner state of `ActionStack`, and end-to-end tests for checking its operation on the UI were added!

Getting confident with tests, I was able to extract the UI functionality from `App` to `HookSample` and started to refactor the code in a way to make it easy to add the other versions and their examples.

I've modified the end-to-end test, so it checks all the examples one-by-one instead of the `App`. With these new integration tests, I could be sure that when implementing HOC and Provider, they work exactly the same as the hook:

```javascript
describe('Integration tests for Hook', e2eTestFor(HookSample));
describe('Integration tests for HOC', e2eTestFor(HOCSample));
describe('Integration tests for Provider', e2eTestFor(ProviderSample));
```

Finally, I applied some last refactors, styles and transitions, and here we are.
