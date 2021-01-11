import { useState } from 'react';

export function useActionStack(initialState) {
  const [state, setState] = useState(initialState);

  return { state, onAction: setState };
}
