import type { Route } from "./+types/home";
import { useState } from "react";
import { usePuzzles } from "../hooks/usePuzzles";
import { usePuzzleGrid } from "../hooks/usePuzzleGrid";
import { usePuzzleSubmission } from "../hooks/usePuzzleSubmission";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "A-MAZE-ING-MAZE" },
    { name: "description", content: "Welcome to the A-MAZE-ING-MAZE!" },
  ];
}

export default function Home() {
  const [puzzleId, setPuzzleId] = useState<number | "">("");
  const [moves, setMoves] = useState("");

  const { puzzles, loading, error: puzzlesError } = usePuzzles();
  const { grid, loading: gridLoading, fetchGrid } = usePuzzleGrid();
  const { result, error: submitError, submitting, submitAttempt } = usePuzzleSubmission();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!puzzleId) return;
    await submitAttempt(puzzleId, moves.trim().split(""));
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">A-MAZE-ING-MAZE</h1>
      {loading && <p>Loading puzzles…</p>}
      {(puzzlesError || submitError) && <p className="text-red-600">{puzzlesError || submitError}</p>}
      {!loading && (
        <>
          <ul className="mb-6 list-disc pl-6">
            {puzzles.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong>
                {p.description ? ` — ${p.description}` : ""}
              </li>
            ))}
          </ul>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block mb-1">Puzzle</label>
              <select
                className="border px-2 py-1"
                value={puzzleId}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : "";
                  setPuzzleId(val);
                  if (typeof val === "number") fetchGrid(val);
                }}
              >
                <option value="">Select…</option>
                {puzzles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Moves (e.g. RRRDDD)</label>
              <input
                className="border px-2 py-1 w-full"
                value={moves}
                onChange={(e) => setMoves(e.target.value.toUpperCase())}
                placeholder="RRRDDD"
              />
            </div>
            <button
              className="bg-black text-white px-3 py-1 disabled:opacity-50"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>

          {result && <p className="mt-4">{result}</p>}

          {gridLoading && <p className="mt-4">Loading grid...</p>}
          {grid && (
            <pre className="mt-6 p-3 bg-gray-600 inline-block">
              {grid.map((row, i) => (
                ` ${row}\n`
              )).join("")}
            </pre>
          )}
        </>
      )}
    </main>
  );
}
