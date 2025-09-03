import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

export function renderWithRouter(
    ui: ReactNode,
    { initialEntries = ['/'] }: { initialEntries?: string[] } = {}
) {
    const router = createMemoryRouter(
        [
            { path: '/', element: ui },
        ],
        { initialEntries }
    );
    return render(<RouterProvider router={router} />);
}
