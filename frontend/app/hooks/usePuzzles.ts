import { useState, useEffect } from 'react';

type Puzzle = { id: number; name: string; description?: string };

export function usePuzzles() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost/api/puzzles");
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        setPuzzles(data.puzzles ?? []);
      } catch (e: any) {
        setError(e.message ?? String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { puzzles, loading, error };
}

// Add display name for React DevTools
usePuzzles.displayName = 'usePuzzles';
