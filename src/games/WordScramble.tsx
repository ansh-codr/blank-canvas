import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { GameShell } from "./GameShell";

const WORDS = ["arcade", "memory", "galaxy", "rocket", "neon", "portal", "puzzle", "dragon", "pixel", "laser"];

const shuffle = (word: string) => {
  const letters = word.split("");
  let shuffled = word;
  while (shuffled === word) {
    shuffled = letters.sort(() => Math.random() - 0.5).join("");
  }
  return shuffled;
};

export const WordScramble = () => {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Unscramble the word.");

  const word = WORDS[index % WORDS.length];
  const scrambled = useMemo(() => shuffle(word), [word]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (input.trim().toLowerCase() === word) {
      setScore((prev) => prev + 1);
      setMessage("Correct! Next word.");
      setInput("");
      setIndex((prev) => prev + 1);
    } else {
      setMessage("Not quite. Try again!");
    }
  };

  const handleSkip = () => {
    setMessage("Skipped! New word.");
    setInput("");
    setIndex((prev) => prev + 1);
  };

  return (
    <GameShell title="Word Scramble" description="Unscramble the word before time runs out.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="text-3xl font-semibold tracking-widest" style={{ color: "#D6E6F3" }}>
          {scrambled}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Your answer"
            className="w-40 rounded-xl border border-blue-200/30 bg-transparent px-4 py-2 text-center text-blue-100 outline-none focus:border-blue-200/70"
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
            style={{ backgroundColor: "rgba(236, 72, 153, 0.85)" }}
          >
            Submit
          </button>
        </form>
        <button
          onClick={handleSkip}
          className="rounded-full border border-blue-200/30 px-5 py-2 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60"
        >
          Skip word
        </button>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {message}
        </p>
        <p className="text-xs" style={{ color: "#A6c5d7" }}>
          Score: {score}
        </p>
      </div>
    </GameShell>
  );
};

export default WordScramble;
