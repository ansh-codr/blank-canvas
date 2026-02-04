import { useEffect, useRef, useState } from "react";
import { GameShell } from "./GameShell";

type Status = "idle" | "waiting" | "go" | "result";

export const ReactionTime = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Click start, then wait for green.");
  const [reaction, setReaction] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startRound = () => {
    setReaction(null);
    setMessage("Wait for green...");
    setStatus("waiting");

    const delay = 1000 + Math.random() * 2000;
    timeoutRef.current = window.setTimeout(() => {
      setStatus("go");
      setMessage("GO!");
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (status === "idle" || status === "result") {
      startRound();
      return;
    }

    if (status === "waiting") {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      setStatus("result");
      setMessage("Too soon! Click to try again.");
      return;
    }

    if (status === "go" && startTimeRef.current !== null) {
      const time = Math.round(performance.now() - startTimeRef.current);
      setReaction(time);
      setStatus("result");
      setMessage(`Your reaction time: ${time}ms. Click to play again.`);
    }
  };

  const bgColor = status === "go" ? "rgba(34, 197, 94, 0.9)" : "rgba(239, 68, 68, 0.7)";

  return (
    <GameShell title="Reaction Time" description="Wait for green, then click as fast as you can.">
      <div className="flex flex-col items-center gap-6 text-center">
        <button
          onClick={handleClick}
          className="w-full max-w-sm rounded-3xl px-8 py-10 text-lg font-semibold text-white transition hover:scale-[1.02]"
          style={{ backgroundColor: bgColor }}
        >
          {status === "idle" ? "Start" : status === "waiting" ? "Wait..." : status === "go" ? "Click!" : "Again"}
        </button>
        <p className="text-sm" style={{ color: "#A6c5d7" }}>
          {message}
        </p>
        {reaction !== null ? (
          <p className="text-xs" style={{ color: "#A6c5d7" }}>
            Fastest wins. Can you beat {reaction}ms?
          </p>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ReactionTime;
