import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts";
import { getActiveGames, Game } from "@/firebase";
import { FaGamepad, FaChartLine, FaTrophy, FaUser, FaCog, FaPlay, FaArrowLeft, FaStar } from "react-icons/fa";

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
    <div className="min-h-screen py-8 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #000926 0%, #0f52ba 100%)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#A6c5d7' }}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#0f52ba' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }}
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#D6E6F3' }}>
              Welcome back, <span style={{ color: '#A6c5d7' }}>{userProfile?.displayName || "Player"}</span>!
            </h1>
            <p style={{ color: '#A6c5d7' }}>Choose a game to play or check the leaderboards</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: 'rgba(166, 197, 215, 0.15)', color: '#D6E6F3', border: '1px solid rgba(166, 197, 215, 0.2)' }}
            >
              <FaUser />
              Profile
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: 'rgba(15, 82, 186, 0.5)', color: '#D6E6F3', border: '1px solid rgba(15, 82, 186, 0.5)' }}
              >
                <FaCog />
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)' }}>
                <FaGamepad className="text-2xl" style={{ color: '#A6c5d7' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Available Games</p>
                <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>{games.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)' }}>
                <FaChartLine className="text-2xl" style={{ color: '#A6c5d7' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Your Score</p>
                <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>
                  {userProfile?.totalScore?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)' }}>
                <FaTrophy className="text-2xl" style={{ color: '#A6c5d7' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Games Played</p>
                <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>
                  {userProfile?.totalGamesPlayed || 0}
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/leaderboard"
            className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] group"
            style={{ background: 'linear-gradient(135deg, #0f52ba 0%, #000926 100%)', borderColor: 'rgba(166, 197, 215, 0.3)' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: 'rgba(214, 230, 243, 0.2)' }}>
                <FaTrophy className="text-2xl" style={{ color: '#D6E6F3' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>View</p>
                <p className="text-xl font-bold" style={{ color: '#D6E6F3' }}>Leaderboards</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Game - Neon Snake */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#D6E6F3' }}>
            <FaStar className="text-yellow-400" />
            Featured Game
          </h2>
          <Link
            to="/games/snake"
            className="block rounded-2xl overflow-hidden border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
            style={{ 
              background: 'linear-gradient(135deg, rgba(15, 82, 186, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)', 
              borderColor: 'rgba(166, 197, 215, 0.3)' 
            }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(45deg, #000926, #0f52ba)' }}>
                  <span className="text-8xl">🐍</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#000926] opacity-60 md:block hidden"></div>
              </div>
              <div className="flex-1 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>Neon Snake</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    NEW
                  </span>
                </div>
                <p className="text-lg mb-5" style={{ color: '#A6c5d7' }}>
                  Classic snake game with neon graphics! Navigate the snake, eat food to grow, 
                  and try to beat your high score. How long can you survive?
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}>
                    <FaPlay />
                    Play Now
                  </span>
                  <div className="flex gap-4">
                    <span className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }}>
                      🎮 Keyboard + Mobile
                    </span>
                    <span className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }}>
                      🏆 Leaderboard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Games Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#D6E6F3' }}>
            <FaGamepad style={{ color: '#A6c5d7' }} />
            Available Games
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(166, 197, 215, 0.2)', borderTopColor: '#0f52ba' }}></div>
            </div>
          ) : games.length === 0 ? (
            <div className="rounded-3xl p-16 border text-center backdrop-blur-xl" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}>
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'rgba(15, 82, 186, 0.2)' }}>
                <FaGamepad className="text-5xl" style={{ color: '#A6c5d7' }} />
              </div>
              <h3 className="text-2xl font-semibold mb-3" style={{ color: '#D6E6F3' }}>No Games Available</h3>
              <p style={{ color: '#A6c5d7' }}>Games will appear here once they are added by an admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="rounded-2xl overflow-hidden border backdrop-blur-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl group"
                  style={{ backgroundColor: 'rgba(0, 9, 38, 0.7)', borderColor: 'rgba(166, 197, 215, 0.15)' }}
                >
                  {game.thumbnailUrl ? (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={game.thumbnailUrl}
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000926] to-transparent opacity-60"></div>
                    </div>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(15, 82, 186, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)' }}>
                      <FaGamepad className="text-6xl opacity-30" style={{ color: '#A6c5d7' }} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold" style={{ color: '#D6E6F3' }}>{game.name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', color: '#A6c5d7' }}>
                        {game.category}
                      </span>
                    </div>
                    <p className="text-sm mb-5 line-clamp-2" style={{ color: '#A6c5d7' }}>
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: '#A6c5d7' }}>
                        Max: {game.maxScore?.toLocaleString() || "∞"}
                      </span>
                      {game.gameUrl ? (
                        <a
                          href={game.gameUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
                          style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
                        >
                          <FaPlay className="text-xs" />
                          Play Now
                        </a>
                      ) : (
                        <span className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }}>
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
