import { useState } from "react";
import type { FormEvent } from "react";
import { GameShell } from "./GameShell";

const getTarget = () => Math.floor(Math.random() * 100) + 1;

export const NumberGuess = () => {
  const [target, setTarget] = useState(getTarget());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Enter a number between 1 and 100.");
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const numericGuess = Number(guess);
    if (!Number.isInteger(numericGuess) || numericGuess < 1 || numericGuess > 100) {
      setMessage("Please enter a whole number from 1 to 100.");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (numericGuess === target) {
      setMessage(`Correct! You got it in ${nextAttempts} tries.`);
      return;
    }

    setMessage(numericGuess < target ? "Too low. Try a higher number." : "Too high. Try a lower number.");
  };

  const handleReset = () => {
    setTarget(getTarget());
    setGuess("");
    setAttempts(0);
    setMessage("Enter a number between 1 and 100.");
  };

  return (
    <GameShell title="Number Guess" description="Guess the hidden number in as few attempts as possible.">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {message}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-3">
          <input
            type="number"
            min={1}
            max={100}
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            placeholder="Your guess"
            className="w-36 rounded-xl border border-blue-200/30 bg-transparent px-4 py-2 text-center text-blue-100 outline-none focus:border-blue-200/70"
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-2 text-sm font-semibold text-white transition hover:scale-105"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.85)" }}
          >
            Guess
          </button>
        </form>
        <button
          onClick={handleReset}
          className="rounded-xl px-5 py-2 text-xs font-semibold text-blue-100 transition hover:scale-105"
          style={{ backgroundColor: "rgba(15, 82, 186, 0.4)" }}
        >
          Reset game
        </button>
        <p className="text-xs" style={{ color: "#A6c5d7" }}>
          Attempts: {attempts}
        </p>
      </div>
    </GameShell>
  );
};

export default NumberGuess;
