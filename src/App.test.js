import { render, screen } from '@testing-library/react';
import App from './App';

test.skip('renders learn react link', () => {
  render(<App />);
  const title = screen.getByText(/ActionStack/i);
  expect(title).toBeInTheDocument();
});
