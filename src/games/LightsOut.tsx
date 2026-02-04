import { useMemo, useState } from "react";
import { GameShell } from "./GameShell";

const size = 3;

const createGrid = () => {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() > 0.5)
  );
  if (grid.flat().every((cell) => !cell)) {
    grid[1][1] = true;
  }
  return grid;
};

export const LightsOut = () => {
  const [grid, setGrid] = useState(createGrid);
  const [moves, setMoves] = useState(0);

  const toggleCell = (row: number, col: number) => {
    setGrid((prev) => {
      const next = prev.map((line) => [...line]);
      const toggle = (r: number, c: number) => {
        if (r < 0 || r >= size || c < 0 || c >= size) return;
        next[r][c] = !next[r][c];
      };
      toggle(row, col);
      toggle(row - 1, col);
      toggle(row + 1, col);
      toggle(row, col - 1);
      toggle(row, col + 1);
      return next;
    });
    setMoves((prev) => prev + 1);
  };

  const won = useMemo(() => grid.flat().every((cell) => !cell), [grid]);

  const reset = () => {
    setGrid(createGrid());
    setMoves(0);
  };

  return (
    <GameShell title="Lights Out" description="Toggle the tiles to turn off all the lights.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="grid grid-cols-3 gap-3">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => toggleCell(rowIndex, colIndex)}
                className="h-16 w-16 rounded-xl transition hover:scale-105"
                style={{
                  backgroundColor: cell ? "rgba(250, 204, 21, 0.9)" : "rgba(15, 23, 42, 0.8)",
                  boxShadow: cell ? "0 0 12px rgba(250, 204, 21, 0.6)" : "none",
                }}
              />
            ))
          )}
        </div>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {won ? "You cleared the board!" : "Keep toggling to clear every light."}
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#A6c5d7" }}>
          <span>Moves: {moves}</span>
          <button
            onClick={reset}
            className="rounded-full border border-blue-200/30 px-5 py-2 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60"
          >
            Reset
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default LightsOut;
