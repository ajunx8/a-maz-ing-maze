import { useState, useCallback } from 'react';

export function usePuzzleSubmission() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submitAttempt = useCallback(async (puzzleId: number, moves: string[]) => {
    setSubmitting(true);
    setResult(null);
    setError(null);
    
    try {
      const res = await fetch("http://localhost/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puzzle_id: puzzleId, moves }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail ?? "Submit failed");
      setResult(data.valid ? "Valid path!" : "Invalid path");
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { result, error, submitting, submitAttempt };
}

// Add display name for React DevTools
usePuzzleSubmission.displayName = 'usePuzzleSubmission';
