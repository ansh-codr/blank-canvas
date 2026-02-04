import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { SplineBackground } from "@/components/SplineBackground";

interface GameShellProps {
  title: string;
  description?: string;
}

export const GameShell = ({ title, description, children }: PropsWithChildren<GameShellProps>) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-transparent">
      <SplineBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: "rgba(166, 197, 215, 0.1)", color: "#A6c5d7" }}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ color: "#D6E6F3" }}>
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-base" style={{ color: "#A6c5d7" }}>
              {description}
            </p>
          ) : null}
        </div>

        <div
          className="rounded-2xl border p-6 backdrop-blur-xl"
          style={{ backgroundColor: "rgba(0, 9, 38, 0.65)", borderColor: "rgba(166, 197, 215, 0.15)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameShell;
