import { render, screen } from '@testing-library/react';
import { Welcome } from './welcome';

test('renders the app title', () => {
    render(<Welcome />);
    expect(screen.getByRole('heading', { level: 1, name: /a-maze-ing-maze/i })).toBeInTheDocument();
});

test('renders the welcome message', () => {
    render(<Welcome />);
    expect(screen.getByText(/welcome to the a-maze-ing-maze/i)).toBeInTheDocument();
});