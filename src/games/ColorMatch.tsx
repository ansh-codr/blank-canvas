import { useState } from "react";
import { GameShell } from "./GameShell";

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const createRound = () => {
  const target = COLORS[Math.floor(Math.random() * COLORS.length)];
  const options = shuffle(COLORS).slice(0, 4);
  if (!options.find((option) => option.name === target.name)) {
    options[0] = target;
  }
  return { target, options: shuffle(options) };
};

export const ColorMatch = () => {
  const [{ target, options }, setRound] = useState(createRound());
  const [message, setMessage] = useState("Match the target color.");
  const [score, setScore] = useState(0);

  const handlePick = (name: string) => {
    if (name === target.name) {
      setScore((prev) => prev + 1);
      setMessage("Nice! New color incoming.");
      window.setTimeout(() => setRound(createRound()), 300);
    } else {
      setMessage("Oops! Try again.");
    }
  };

  const handleReset = () => {
    setScore(0);
    setMessage("Match the target color.");
    setRound(createRound());
  };

  return (
    <GameShell title="Color Match" description="Pick the button that matches the target color.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest" style={{ color: "#A6c5d7" }}>
            Target
          </p>
          <div className="text-3xl font-semibold" style={{ color: target.value }}>
            {target.name}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <button
              key={option.name}
              onClick={() => handlePick(option.name)}
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:scale-105"
              style={{ backgroundColor: option.value }}
            >
              {option.name}
            </button>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {message}
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#A6c5d7" }}>
          <span>Score: {score}</span>
          <button
            onClick={handleReset}
            className="rounded-full border border-blue-200/30 px-4 py-1 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60"
          >
            Reset
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default ColorMatch;
