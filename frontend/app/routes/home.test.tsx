import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import { renderWithRouter } from '../test/render';
import Home from './home';

function createFetchResponse(data: any, ok = true, status = 200) {
    return {
        ok,
        status,
        json: async () => data,
    } as Response;
}

describe('Home route', () => {
    const puzzles = {
        puzzles: [
            { id: 1, name: 'Easy Maze', description: 'Small 5x5 grid' },
            { id: 2, name: 'Key & Door', description: 'Collect key, open door' },
        ],
    };

    beforeEach(() => {
        vi.spyOn(global, 'fetch');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('lists puzzles from API', async () => {
        (global.fetch as any)
            .mockResolvedValueOnce(createFetchResponse(puzzles)); // GET /api/puzzles

        renderWithRouter(<Home />);

        const list = await screen.findByRole('list');
        expect(within(list).getByText('Easy Maze')).toBeInTheDocument();
        expect(within(list).getByText(/Key & Door/)).toBeInTheDocument();
    });

    it('fetches and renders grid when a puzzle is selected', async () => {
        (global.fetch as any)
            .mockResolvedValueOnce(createFetchResponse(puzzles)) // GET /api/puzzles
            .mockResolvedValueOnce(
                createFetchResponse({ ok: true, name: 'Easy Maze', grid: ['S...', '.##.', '....', '...G'] })
            ); // GET /api/puzzles/1/grid

        renderWithRouter(<Home />);

        // wait for list to load (scope to list to avoid select options)
        const list = await screen.findByRole('list');
        within(list).getByText('Easy Maze');

        const select = screen.getByLabelText('Puzzle');
        fireEvent.change(select, { target: { value: '1' } });

        await waitFor(() => {
            expect(screen.getByText(/S\.\.\./)).toBeInTheDocument();
            expect(screen.getByText(/\.\.\.G/)).toBeInTheDocument();
        });
    });

    it('submits moves and shows result', async () => {
        (global.fetch as any)
            .mockResolvedValueOnce(createFetchResponse(puzzles)) // GET /api/puzzles
            .mockResolvedValueOnce(
                createFetchResponse({ ok: true, name: 'Easy Maze', grid: ['S...', '.##.', '....', '...G'] })
            ) // GET /api/puzzles/1/grid
            .mockResolvedValueOnce(createFetchResponse({ ok: true, attempt_id: 10, valid: true })); // POST /api/attempts

        renderWithRouter(<Home />);

        const list = await screen.findByRole('list');
        within(list).getByText('Easy Maze');

        const select = screen.getByLabelText('Puzzle');
        fireEvent.change(select, { target: { value: '1' } });

        // wait grid render
        await screen.findByText(/S\.\.\./);

        const input = screen.getByPlaceholderText('RRRDDD');
        fireEvent.change(input, { target: { value: 'RRRDDD' } });

        const submit = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submit);

        await waitFor(() => {
            expect(screen.getByText(/Valid path!/i)).toBeInTheDocument();
        });
    });
});


