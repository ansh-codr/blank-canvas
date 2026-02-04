import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts";
import { getActiveGames, Game } from "@/firebase";
import { FaGamepad, FaChartLine, FaTrophy, FaUser, FaCog, FaPlay, FaArrowLeft, FaStar } from "react-icons/fa";
import { SplineBackground } from "@/components/SplineBackground";

// Game icons and colors mapping
const GAME_STYLES: Record<string, { icon: string; gradient: string; badge: { text: string; color: string }; buttonColor: string }> = {
  "Neon Snake": { 
    icon: "🐍", 
    gradient: "linear-gradient(135deg, rgba(15, 82, 186, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "CLASSIC", color: "green" },
    buttonColor: "#0f52ba"
  },
  "Tic Tac Toe": { 
    icon: "⭕", 
    gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "AI", color: "purple" },
    buttonColor: "#8b5cf6"
  },
  "Memory Match": { 
    icon: "🧠", 
    gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "BRAIN", color: "pink" },
    buttonColor: "#ec4899"
  },
  "Rock Paper Scissors": { 
    icon: "✊", 
    gradient: "linear-gradient(135deg, rgba(239, 68, 68, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "BATTLE", color: "red" },
    buttonColor: "#ef4444"
  },
  "Coin Flip": {
    icon: "🪙",
    gradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "LUCK", color: "yellow" },
    buttonColor: "#eab308"
  },
  "Dice Roll": {
    icon: "🎲",
    gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "CHANCE", color: "blue" },
    buttonColor: "#3b82f6"
  },
  "Number Guess": {
    icon: "🔢",
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "LOGIC", color: "green" },
    buttonColor: "#10b981"
  },
  "Color Match": {
    icon: "🎨",
    gradient: "linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "SPEED", color: "purple" },
    buttonColor: "#a855f7"
  },
  "Quick Tap": {
    icon: "⚡",
    gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "REFLEX", color: "blue" },
    buttonColor: "#3b82f6"
  },
  "Reaction Time": {
    icon: "⏱️",
    gradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "FOCUS", color: "green" },
    buttonColor: "#22c55e"
  },
  "Word Scramble": {
    icon: "🔤",
    gradient: "linear-gradient(135deg, rgba(244, 114, 182, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "WORD", color: "pink" },
    buttonColor: "#f472b6"
  },
  "Pattern Memory": {
    icon: "🧩",
    gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "SEQUENCE", color: "purple" },
    buttonColor: "#6366f1"
  },
  "Lights Out": {
    icon: "💡",
    gradient: "linear-gradient(135deg, rgba(148, 163, 184, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "PUZZLE", color: "blue" },
    buttonColor: "#94a3b8"
  },
  "Emoji Hunt": {
    icon: "🕵️",
    gradient: "linear-gradient(135deg, rgba(251, 146, 60, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "OBSERVE", color: "yellow" },
    buttonColor: "#fb923c"
  },
};

const getGameStyle = (gameName: string) => {
  return GAME_STYLES[gameName] || { 
    icon: "🎮", 
    gradient: "linear-gradient(135deg, rgba(15, 82, 186, 0.4) 0%, rgba(0, 9, 38, 0.8) 100%)",
    badge: { text: "NEW", color: "blue" },
    buttonColor: "#0f52ba"
  };
};

const getBadgeColors = (color: string) => {
  const colors: Record<string, string> = {
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[color] || colors.blue;
};

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
    <div className="min-h-screen py-8 px-4 relative overflow-hidden bg-transparent">
      {/* Spline 3D Background */}
      <SplineBackground />

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

        {/* Featured Games - Data Driven from Firebase */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#D6E6F3' }}>
            <FaStar className="text-yellow-400" />
            Featured Games
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(166, 197, 215, 0.2)', borderTopColor: '#0f52ba' }}></div>
            </div>
          ) : games.length === 0 ? (
            <div className="rounded-3xl p-12 border text-center backdrop-blur-xl" style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}>
              <FaGamepad className="text-5xl mx-auto mb-4" style={{ color: '#A6c5d7' }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#D6E6F3' }}>No Games Available</h3>
              <p style={{ color: '#A6c5d7' }}>Games will appear here once configured.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {games.map((game) => {
                const style = getGameStyle(game.name);
                const badgeColors = getBadgeColors(style.badge.color);
                
                return (
                  <Link
                    key={game.id}
                    to={game.gameUrl || "#"}
                    className="block rounded-2xl overflow-hidden border backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
                    style={{ 
                      background: style.gradient, 
                      borderColor: 'rgba(166, 197, 215, 0.3)' 
                    }}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(45deg, #000926, #0f52ba)' }}>
                          <span className="text-4xl">{style.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>{game.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColors}`}>
                              {style.badge.text}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: '#A6c5d7' }}>{game.category}</p>
                        </div>
                      </div>
                      <p className="mb-4 line-clamp-2" style={{ color: '#A6c5d7' }}>
                        {game.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all duration-300 group-hover:scale-105"
                          style={{ backgroundColor: style.buttonColor, color: '#D6E6F3' }}>
                          <FaPlay />
                          Play
                        </span>
                        <span className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }}>
                          🏆 Plays: {game.playCount || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#D6E6F3' }}>
            <FaGamepad style={{ color: '#A6c5d7' }} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/leaderboard"
              className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] backdrop-blur-xl"
              style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}
            >
              <FaTrophy className="text-3xl text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold" style={{ color: '#D6E6F3' }}>Leaderboards</h3>
              <p className="text-sm" style={{ color: '#A6c5d7' }}>See top players</p>
            </Link>
            <Link
              to="/profile"
              className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] backdrop-blur-xl"
              style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', borderColor: 'rgba(166, 197, 215, 0.15)' }}
            >
              <FaUser className="text-3xl mb-3" style={{ color: '#A6c5d7' }} />
              <h3 className="text-lg font-semibold" style={{ color: '#D6E6F3' }}>Your Profile</h3>
              <p className="text-sm" style={{ color: '#A6c5d7' }}>View your stats</p>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] backdrop-blur-xl"
                style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', borderColor: 'rgba(15, 82, 186, 0.5)' }}
              >
                <FaCog className="text-3xl mb-3" style={{ color: '#A6c5d7' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#D6E6F3' }}>Admin Panel</h3>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Manage games & users</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
