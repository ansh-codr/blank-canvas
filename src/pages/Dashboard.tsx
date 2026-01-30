import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts";
import { getActiveGames, Game } from "@/firebase";
import { FaGamepad, FaChartLine, FaTrophy, FaUser, FaCog } from "react-icons/fa";

export const Dashboard = () => {
  const { userProfile, isAdmin } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      const activeGames = await getActiveGames();
      setGames(activeGames);
      setLoading(false);
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {userProfile?.displayName || "Player"}!
            </h1>
            <p className="text-violet-300">Choose a game to play or check the leaderboards</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition"
            >
              <FaUser />
              Profile
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg text-yellow-300 transition"
              >
                <FaCog />
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FaGamepad className="text-xl text-blue-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Total Games</p>
                <p className="text-2xl font-bold text-white">{games.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FaChartLine className="text-xl text-green-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Your Score</p>
                <p className="text-2xl font-bold text-white">
                  {userProfile?.totalScore?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FaTrophy className="text-xl text-purple-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Games Played</p>
                <p className="text-2xl font-bold text-white">
                  {userProfile?.totalGamesPlayed || 0}
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/leaderboard"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl p-6 border border-white/20 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition">
                <FaTrophy className="text-xl text-white" />
              </div>
              <div>
                <p className="text-violet-200 text-sm">View</p>
                <p className="text-xl font-bold text-white">Leaderboards</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Games Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FaGamepad className="text-violet-400" />
            Available Games
          </h2>

          {loading ? (
            <div className="text-center text-violet-300 py-12">Loading games...</div>
          ) : games.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
              <FaGamepad className="text-6xl text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Games Available</h3>
              <p className="text-violet-300">
                Games will appear here once they are added by an admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-violet-500/50 transition group"
                >
                  {game.thumbnailUrl ? (
                    <img
                      src={game.thumbnailUrl}
                      alt={game.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-violet-600/50 to-purple-600/50 flex items-center justify-center">
                      <FaGamepad className="text-6xl text-white/50" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      <span className="px-2 py-1 bg-violet-500/20 rounded text-violet-300 text-xs">
                        {game.category}
                      </span>
                    </div>
                    <p className="text-violet-300 text-sm mb-4 line-clamp-2">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-violet-400">
                        Max Score: {game.maxScore?.toLocaleString() || "∞"}
                      </span>
                      {game.gameUrl ? (
                        <a
                          href={game.gameUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition"
                        >
                          Play Now
                        </a>
                      ) : (
                        <span className="px-4 py-2 bg-gray-600/50 text-gray-400 text-sm font-semibold rounded-lg">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
