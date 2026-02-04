import { useState } from "react";
import { GameShell } from "./GameShell";

const getRandomSide = () => (Math.random() < 0.5 ? "Heads" : "Tails");

export const CoinFlip = () => {
  const [result, setResult] = useState<string | null>(null);
  const [flipping, setFlipping] = useState(false);

  const handleFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);

    window.setTimeout(() => {
      setResult(getRandomSide());
      setFlipping(false);
    }, 700);
  };

  return (
    <GameShell title="Coin Flip" description="Heads or tails? Tap flip and test your luck.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`text-6xl ${flipping ? "animate-pulse" : ""}`}>
          {flipping ? "🪙" : result === "Heads" ? "🙂" : result === "Tails" ? "🚀" : "🪙"}
        </div>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {result ? `Result: ${result}` : "Ready when you are."}
        </p>
        <button
          onClick={handleFlip}
          disabled={flipping}
          className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: "rgba(15, 82, 186, 0.8)" }}
        >
          {flipping ? "Flipping..." : "Flip"}
        </button>
      </div>
    </GameShell>
  );
};

export default CoinFlip;
