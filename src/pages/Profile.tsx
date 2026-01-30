import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { getUserScores, Score } from "@/firebase";
import { FaUser, FaGamepad, FaTrophy, FaSignOutAlt, FaEdit, FaArrowLeft, FaCalendar } from "react-icons/fa";
import { SplineBackground } from "@/components/SplineBackground";

export const Profile = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      if (user) {
        const userScores = await getUserScores(user.uid);
        setScores(userScores);
      }
      setLoading(false);
    };

    fetchScores();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
        <SplineBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent relative z-10" style={{ borderColor: '#A6c5d7', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-transparent">
      {/* Spline 3D Background */}
      <SplineBackground />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div 
          className="backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-8"
          style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                  style={{ border: '4px solid #0f52ba' }}
                />
              ) : (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#0f52ba', border: '4px solid #A6c5d7' }}
                >
                  <FaUser className="text-4xl" style={{ color: '#D6E6F3' }} />
                </div>
              )}
              <button 
                className="absolute bottom-0 right-0 p-2 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: '#0f52ba' }}
              >
                <FaEdit className="text-sm" style={{ color: '#D6E6F3' }} />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold mb-1" style={{ color: '#D6E6F3' }}>
                {userProfile.displayName}
              </h1>
              <p style={{ color: '#A6c5d7' }}>{user.email}</p>
              {userProfile.isAdmin && (
                <span 
                  className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', border: '1px solid rgba(234, 179, 8, 0.5)', color: '#fbbf24' }}
                >
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171' }}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)' }}>
                <FaGamepad className="text-2xl" style={{ color: '#A6c5d7' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Games Played</p>
                <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>
                  {userProfile.totalGamesPlayed || 0}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}>
                <FaTrophy className="text-2xl text-green-400" />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Total Score</p>
                <p className="text-2xl font-bold" style={{ color: '#D6E6F3' }}>
                  {userProfile.totalScore?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(15, 82, 186, 0.3)' }}>
                <FaCalendar className="text-2xl" style={{ color: '#0f52ba' }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A6c5d7' }}>Member Since</p>
                <p className="text-lg font-bold" style={{ color: '#D6E6F3' }}>
                  {userProfile.createdAt
                    ? new Date(
                        "toDate" in userProfile.createdAt
                          ? userProfile.createdAt.toDate()
                          : userProfile.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Scores */}
        <div 
          className="backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#D6E6F3' }}>Recent Scores</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: '#A6c5d7', borderTopColor: 'transparent' }}></div>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-8" style={{ color: '#A6c5d7' }}>
              No scores yet. Start playing to track your progress!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(166, 197, 215, 0.2)' }}>
                    <th className="text-left py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Game</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Score</th>
                    <th className="text-right py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr 
                      key={score.id} 
                      className="transition-colors hover:bg-white/5"
                      style={{ borderBottom: '1px solid rgba(166, 197, 215, 0.1)' }}
                    >
                      <td className="py-3 px-4" style={{ color: '#D6E6F3' }}>{score.gameName}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-semibold">
                        {score.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-sm" style={{ color: '#A6c5d7' }}>
                        {score.createdAt
                          ? new Date(
                              "toDate" in score.createdAt
                                ? score.createdAt.toDate()
                                : score.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
