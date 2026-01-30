import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveGames, getLeaderboard, Game, Score } from "@/firebase";
import { FaTrophy, FaMedal, FaGamepad, FaCrown, FaArrowLeft } from "react-icons/fa";

export const Leaderboard = () => {
  const navigate = useNavigate();
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
        return <span className="font-bold w-6 text-center" style={{ color: '#A6c5d7' }}>{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return { background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.2), rgba(217, 119, 6, 0.2))', border: '1px solid rgba(234, 179, 8, 0.3)' };
      case 1:
        return { background: 'linear-gradient(90deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.2))', border: '1px solid rgba(156, 163, 175, 0.3)' };
      case 2:
        return { background: 'linear-gradient(90deg, rgba(217, 119, 6, 0.2), rgba(234, 88, 12, 0.2))', border: '1px solid rgba(217, 119, 6, 0.3)' };
      default:
        return { backgroundColor: 'rgba(0, 9, 38, 0.5)', border: '1px solid rgba(166, 197, 215, 0.1)' };
    }
  };

  return (
    <div 
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #000926 0%, #0f52ba 100%)' }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', top: '10%', left: '15%' }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)', bottom: '15%', right: '10%', animationDelay: '1s' }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', top: '60%', left: '50%', animationDelay: '2s' }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
        >
          <FaArrowLeft />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center p-4 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)' }}
          >
            <FaTrophy className="text-4xl text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#D6E6F3' }}>Leaderboards</h1>
          <p style={{ color: '#A6c5d7' }}>See who's dominating the games</p>
        </div>

        {/* Game Selector */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#A6c5d7', borderTopColor: 'transparent' }}></div>
          </div>
        ) : games.length === 0 ? (
          <div 
            className="backdrop-blur-xl rounded-2xl p-12 text-center"
            style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
          >
            <FaGamepad className="text-6xl mx-auto mb-4" style={{ color: '#0f52ba' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#D6E6F3' }}>No Games Available</h3>
            <p style={{ color: '#A6c5d7' }}>Leaderboards will appear once games are added.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id!)}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={
                    selectedGame === game.id
                      ? { backgroundColor: '#0f52ba', color: '#D6E6F3' }
                      : { backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }
                  }
                >
                  {game.name}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <div 
              className="backdrop-blur-xl rounded-2xl p-6"
              style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
            >
              {leaderboardLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: '#A6c5d7', borderTopColor: 'transparent' }}></div>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <FaTrophy className="text-4xl mx-auto mb-4" style={{ color: '#0f52ba' }} />
                  <p style={{ color: '#A6c5d7' }}>No scores yet. Be the first to play!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((score, index) => (
                    <div
                      key={score.id}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                      style={getRankBg(index)}
                    >
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#D6E6F3' }}>
                          {score.displayName || "Anonymous"}
                        </p>
                        <p className="text-sm" style={{ color: '#A6c5d7' }}>
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
                        <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>
                          {score.score.toLocaleString()}
                        </p>
                        <p className="text-xs" style={{ color: '#A6c5d7' }}>points</p>
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
