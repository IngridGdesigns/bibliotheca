import React from 'react';
import { render } from "@testing-library/react";
import App from './App';

it('renders without crashing', () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
