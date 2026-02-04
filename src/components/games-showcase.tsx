import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const GAMES = [
  {
    name: "Memory Match",
    description: "Flip cards, find pairs, and train your memory.",
    path: "/games/memory",
    tag: "MEMORY",
    color: "rgba(236, 72, 153, 0.35)",
  },
  {
    name: "Coin Flip",
    description: "Heads or tails? Test your luck in one tap.",
    path: "/games/coin-flip",
    tag: "LUCK",
    color: "rgba(234, 179, 8, 0.35)",
  },
  {
    name: "Dice Roll",
    description: "Roll the dice and chase perfect streaks.",
    path: "/games/dice-roll",
    tag: "CHANCE",
    color: "rgba(59, 130, 246, 0.35)",
  },
  {
    name: "Number Guess",
    description: "Crack the hidden number in as few tries as possible.",
    path: "/games/number-guess",
    tag: "LOGIC",
    color: "rgba(16, 185, 129, 0.35)",
  },
  {
    name: "Color Match",
    description: "Match the target color fast to keep your streak alive.",
    path: "/games/color-match",
    tag: "SPEED",
    color: "rgba(168, 85, 247, 0.35)",
  },
  {
    name: "Quick Tap",
    description: "Tap as fast as you can before the timer runs out.",
    path: "/games/quick-tap",
    tag: "REFLEX",
    color: "rgba(59, 130, 246, 0.35)",
  },
  {
    name: "Reaction Time",
    description: "Wait for green, then click as fast as possible.",
    path: "/games/reaction-time",
    tag: "FOCUS",
    color: "rgba(34, 197, 94, 0.35)",
  },
  {
    name: "Word Scramble",
    description: "Unscramble words and build your streak.",
    path: "/games/word-scramble",
    tag: "WORD",
    color: "rgba(244, 114, 182, 0.35)",
  },
  {
    name: "Pattern Memory",
    description: "Repeat the glowing sequence to level up.",
    path: "/games/pattern-memory",
    tag: "SEQUENCE",
    color: "rgba(99, 102, 241, 0.35)",
  },
  {
    name: "Lights Out",
    description: "Turn off every tile in the fewest moves.",
    path: "/games/lights-out",
    tag: "PUZZLE",
    color: "rgba(148, 163, 184, 0.35)",
  },
  {
    name: "Emoji Hunt",
    description: "Find the odd emoji to score quick points.",
    path: "/games/emoji-hunt",
    tag: "OBSERVE",
    color: "rgba(251, 146, 60, 0.35)",
  },
  {
    name: "Neon Snake",
    description: "Classic snake action with neon glow vibes.",
    path: "/games/snake",
    tag: "CLASSIC",
    color: "rgba(14, 165, 233, 0.35)",
  },
  {
    name: "Tic Tac Toe",
    description: "Battle a smart AI in three difficulty modes.",
    path: "/games/tictactoe",
    tag: "AI",
    color: "rgba(139, 92, 246, 0.35)",
  },
  {
    name: "Rock Paper Scissors",
    description: "Read the AI and build a winning streak.",
    path: "/games/rps",
    tag: "BATTLE",
    color: "rgba(248, 113, 113, 0.35)",
  },
];

export const GamesShowcase = () => {
  return (
    <section id="games" className="relative bg-[#000926] py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#000926] via-[#000926]/95 to-black" />
      <div className="container mx-auto relative z-10 px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="font-general text-sm uppercase text-blue-200/70">Playable now</p>
            <h2 className="special-font text-4xl text-blue-100 md:text-5xl">
              Mini games, m<b>a</b>jor vibes
            </h2>
            <p className="text-base text-blue-200/70">
              Jump into quick, easy-to-learn challenges. Perfect for a fast break or a competitive warm-up.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 px-6 py-3 text-sm font-semibold text-blue-100 transition hover:border-blue-200/60 hover:bg-blue-200/10"
          >
            View all games
            <FaPlay className="text-xs" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <Link
              key={game.name}
              to={game.path}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20"
            >
              <div
                className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at top left, ${game.color} 0%, transparent 60%)` }}
              />
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex w-fit rounded-full border border-blue-200/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                    {game.tag}
                  </span>
                  <h3 className="text-xl font-semibold text-blue-50">{game.name}</h3>
                  <p className="text-sm text-blue-200/70">{game.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-100">
                  Play now
                  <FaPlay className="text-xs" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesShowcase;
