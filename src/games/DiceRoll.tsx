import { useState } from "react";
import { GameShell } from "./GameShell";

const roll = () => Math.floor(Math.random() * 6) + 1;

export const DiceRoll = () => {
  const [value, setValue] = useState(roll());
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    window.setTimeout(() => {
      setValue(roll());
      setRolling(false);
    }, 600);
  };

  return (
    <GameShell title="Dice Roll" description="Roll the dice and chase your lucky streak.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className={`text-7xl ${rolling ? "animate-bounce" : ""}`}>🎲</div>
        <p className="text-lg font-semibold" style={{ color: "#D6E6F3" }}>
          {rolling ? "Rolling..." : `You rolled a ${value}`}
        </p>
        <button
          onClick={handleRoll}
          disabled={rolling}
          className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: "rgba(99, 102, 241, 0.85)" }}
        >
          Roll again
        </button>
      </div>
    </GameShell>
  );
};

export default DiceRoll;
