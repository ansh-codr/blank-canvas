import { useState } from "react";
import { GameShell } from "./GameShell";

const EMOJI_PAIRS = [
  ["😀", "😎"],
  ["🐶", "🐱"],
  ["🍎", "🍐"],
  ["⭐", "✨"],
  ["🎈", "🎉"],
  ["🚀", "🛸"],
  ["⚡", "🔥"],
  ["🏀", "⚽"],
];

const createRound = () => {
  const pair = EMOJI_PAIRS[Math.floor(Math.random() * EMOJI_PAIRS.length)];
  const oddIndex = Math.floor(Math.random() * 9);
  const cells = Array.from({ length: 9 }, (_, index) => (index === oddIndex ? pair[1] : pair[0]));
  return { pair, oddIndex, cells };
};

export const EmojiHunt = () => {
  const [round, setRound] = useState(createRound());
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Find the odd emoji.");

  const handlePick = (index: number) => {
    if (index === round.oddIndex) {
      setScore((prev) => prev + 1);
      setMessage("Nice spot! New round.");
      setRound(createRound());
    } else {
      setMessage("Not that one! Try again.");
    }
  };

  const reset = () => {
    setScore(0);
    setMessage("Find the odd emoji.");
    setRound(createRound());
  };

  return (
    <GameShell title="Emoji Hunt" description="Spot the emoji that doesn't match the rest.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="grid grid-cols-3 gap-3">
          {round.cells.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              onClick={() => handlePick(index)}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 text-3xl transition hover:scale-105"
            >
              {emoji}
            </button>
          ))}
        </div>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {message}
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: "#A6c5d7" }}>
          <span>Score: {score}</span>
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

export default EmojiHunt;
