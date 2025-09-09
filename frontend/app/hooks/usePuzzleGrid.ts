import { useState } from 'react';

export function usePuzzleGrid() {
  const [grid, setGrid] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGrid = async (id: number) => {
    try {
      setLoading(true);
      setGrid(null);
      const res = await fetch(`http://localhost/api/puzzles/${id}/grid`);
      const data = await res.json();
      if (data.ok) setGrid(data.grid);
    } catch (error) {
      console.error('Failed to fetch grid:', error);
    } finally {
      setLoading(false);
    }
  };

  return { grid, loading, fetchGrid };
}
