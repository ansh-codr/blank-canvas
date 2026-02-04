import { useEffect, useState } from "react";
import { GameShell } from "./GameShell";

export const QuickTap = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [running, timeLeft]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(5);
    setRunning(true);
  };

  const handleTap = () => {
    if (!running) return;
    setScore((prev) => prev + 1);
  };

  return (
    <GameShell title="Quick Tap" description="Tap the button as fast as you can in 5 seconds.">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-6 text-sm" style={{ color: "#A6c5d7" }}>
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
        </div>
        <button
          onClick={handleTap}
          className="rounded-2xl px-10 py-6 text-lg font-semibold text-white transition hover:scale-105"
          style={{ backgroundColor: running ? "rgba(59, 130, 246, 0.85)" : "rgba(59, 130, 246, 0.4)" }}
        >
          Tap!
        </button>
        <button
          onClick={handleStart}
          className="rounded-full border border-blue-200/30 px-5 py-2 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60"
        >
          {running ? "Restart" : "Start"}
        </button>
      </div>
    </GameShell>
  );
};

export default QuickTap;
