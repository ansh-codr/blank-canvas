import { useState, useEffect } from "react";
import { getActiveGames, getLeaderboard, Game, Score } from "@/firebase";
import { FaTrophy, FaMedal, FaGamepad, FaCrown } from "react-icons/fa";

export const Leaderboard = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      const activeGames = await getActiveGames();
      setGames(activeGames);
      if (activeGames.length > 0) {
        setSelectedGame(activeGames[0].id!);
      }
      setLoading(false);
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedGame) return;
      
      setLeaderboardLoading(true);
      const scores = await getLeaderboard(selectedGame, 50);
      setLeaderboard(scores);
      setLeaderboardLoading(false);
    };

    fetchLeaderboard();
  }, [selectedGame]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FaCrown className="text-yellow-400 text-xl" />;
      case 1:
        return <FaMedal className="text-gray-300 text-xl" />;
      case 2:
        return <FaMedal className="text-amber-600 text-xl" />;
      default:
        return <span className="text-violet-300 font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case 1:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 2:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-yellow-500/20 rounded-full mb-4">
            <FaTrophy className="text-4xl text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
          <p className="text-violet-300">See who's dominating the games</p>
        </div>

        {/* Game Selector */}
        {loading ? (
          <div className="text-center text-violet-300 py-12">Loading games...</div>
        ) : games.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <FaGamepad className="text-6xl text-violet-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Games Available</h3>
            <p className="text-violet-300">Leaderboards will appear once games are added.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id!)}
                  className={`px-6 py-3 rounded-xl font-semibold transition ${
                    selectedGame === game.id
                      ? "bg-violet-600 text-white"
                      : "bg-white/10 text-violet-300 hover:bg-white/20"
                  }`}
                >
                  {game.name}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              {leaderboardLoading ? (
                <div className="text-center text-violet-300 py-12">Loading leaderboard...</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <FaTrophy className="text-4xl text-violet-400 mx-auto mb-4" />
                  <p className="text-violet-300">No scores yet. Be the first to play!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((score, index) => (
                    <div
                      key={score.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBg(index)}`}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">
                          {score.displayName || "Anonymous"}
                        </p>
                        <p className="text-sm text-violet-300">
                          {score.createdAt
                            ? new Date(
                                "toDate" in score.createdAt
                                  ? score.createdAt.toDate()
                                  : score.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {score.score.toLocaleString()}
                        </p>
                        <p className="text-xs text-violet-300">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
