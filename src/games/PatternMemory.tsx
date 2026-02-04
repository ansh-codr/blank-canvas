import { useState } from "react";
import { GameShell } from "./GameShell";

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#facc15" },
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const PatternMemory = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userIndex, setUserIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState("Press start to begin.");
  const [level, setLevel] = useState(0);

  const playSequence = async (seq: number[]) => {
    setIsShowing(true);
    for (const index of seq) {
      setActiveIndex(index);
      await wait(450);
      setActiveIndex(null);
      await wait(150);
    }
    setIsShowing(false);
    setUserIndex(0);
  };

  const startGame = () => {
    const next = [Math.floor(Math.random() * COLORS.length)];
    setSequence(next);
    setLevel(1);
    setMessage("Watch the sequence!");
    void playSequence(next);
  };

  const handlePick = (index: number) => {
    if (isShowing || sequence.length === 0) return;

    if (sequence[userIndex] === index) {
      if (userIndex === sequence.length - 1) {
        const next = [...sequence, Math.floor(Math.random() * COLORS.length)];
        setSequence(next);
        setLevel((prev) => prev + 1);
        setMessage("Nice! Next level.");
        void playSequence(next);
      } else {
        setUserIndex((prev) => prev + 1);
      }
      return;
    }

    setMessage("Oops! Sequence reset. Try again.");
    setSequence([]);
    setLevel(0);
    setUserIndex(0);
  };

  return (
    <GameShell title="Pattern Memory" description="Repeat the sequence to level up.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="grid grid-cols-2 gap-4">
          {COLORS.map((color, index) => (
            <button
              key={color.name}
              onClick={() => handlePick(index)}
              className="h-24 w-24 rounded-2xl transition hover:scale-105"
              style={{
                backgroundColor: color.value,
                opacity: activeIndex === index ? 1 : 0.6,
                boxShadow: activeIndex === index ? `0 0 20px ${color.value}` : "none",
              }}
            />
          ))}
        </div>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {message}
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#A6c5d7" }}>
          <span>Level: {level}</span>
          <button
            onClick={startGame}
            className="rounded-full border border-blue-200/30 px-5 py-2 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60"
          >
            Start
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default PatternMemory;
