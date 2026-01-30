import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { getUserScores, Score } from "@/firebase";
import { FaUser, FaGamepad, FaTrophy, FaSignOutAlt, FaEdit } from "react-icons/fa";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-violet-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center border-4 border-violet-500">
                  <FaUser className="text-4xl text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full hover:bg-violet-700 transition">
                <FaEdit className="text-white text-sm" />
              </button>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">
                {userProfile.displayName}
              </h1>
              <p className="text-violet-300">{user.email}</p>
              {userProfile.isAdmin && (
                <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-300 text-sm">
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <FaGamepad className="text-2xl text-blue-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Games Played</p>
                <p className="text-2xl font-bold text-white">
                  {userProfile.totalGamesPlayed || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <FaTrophy className="text-2xl text-green-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Total Score</p>
                <p className="text-2xl font-bold text-white">
                  {userProfile.totalScore?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FaUser className="text-2xl text-purple-400" />
              </div>
              <div>
                <p className="text-violet-300 text-sm">Member Since</p>
                <p className="text-lg font-bold text-white">
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
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Scores</h2>
          {loading ? (
            <div className="text-center text-violet-300 py-8">Loading scores...</div>
          ) : scores.length === 0 ? (
            <div className="text-center text-violet-300 py-8">
              No scores yet. Start playing to track your progress!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-violet-300 font-medium">Game</th>
                    <th className="text-right py-3 px-4 text-violet-300 font-medium">Score</th>
                    <th className="text-right py-3 px-4 text-violet-300 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score) => (
                    <tr key={score.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{score.gameName}</td>
                      <td className="py-3 px-4 text-right text-green-400 font-semibold">
                        {score.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-violet-300 text-sm">
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
