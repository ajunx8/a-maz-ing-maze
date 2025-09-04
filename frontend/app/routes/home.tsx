import type { Route } from "./+types/home";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "A-MAZE-ING-MAZE" },
    { name: "description", content: "Welcome to the A-MAZE-ING-MAZE!" },
  ];
}

type Puzzle = { id: number; name: string; description?: string };

export default function Home() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puzzleId, setPuzzleId] = useState<number | "">("");
  const [moves, setMoves] = useState("");
  const [result, setResult] = useState<string | null>(null);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setError(null);
    try {
      if (!puzzleId) throw new Error("Select a puzzle");
      const res = await fetch("http://localhost/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puzzle_id: puzzleId, moves: moves.trim().split("") }),
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) throw new Error(data.detail ?? "Submit failed");
      setResult(data.valid ? "Valid path!" : "Invalid path");
    } catch (e: any) {
      setError(e.message ?? String(e));
    }
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">A-MAZE-ING-MAZE</h1>
      {loading && <p>Loading puzzles…</p>}
      {error && <p className="text-red-600">{error}</p>}
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
                onChange={(e) => setPuzzleId(e.target.value ? Number(e.target.value) : "")}
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
            <button className="bg-black text-white px-3 py-1" type="submit">
              Submit
            </button>
          </form>

          {result && <p className="mt-4">{result}</p>}
        </>
      )}
    </main>
  );
}
