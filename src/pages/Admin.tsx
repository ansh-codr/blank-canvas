import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import {
  getAllUsers,
  setUserAdmin,
  getGames,
  createGame,
  updateGame,
  deleteGame,
  Game,
  UserProfile,
} from "@/firebase";
import {
  FaUsers,
  FaGamepad,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCrown,
  FaChartBar,
  FaArrowLeft,
} from "react-icons/fa";
import { SplineBackground } from "@/components/SplineBackground";

type Tab = "users" | "games" | "stats";

export const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // Game form state
  const [gameForm, setGameForm] = useState({
    name: "",
    description: "",
    category: "",
    gameUrl: "",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }

    const fetchData = async () => {
      const [fetchedUsers, fetchedGames] = await Promise.all([
        getAllUsers(),
        getGames(),
      ]);
      setUsers(fetchedUsers);
      setGames(fetchedGames);
      setLoading(false);
    };

    fetchData();
  }, [isAdmin, navigate]);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    await setUserAdmin(userId, !currentStatus);
    setUsers(
      users.map((u) =>
        u.uid === userId ? { ...u, isAdmin: !currentStatus } : u
      )
    );
  };

  const handleOpenGameModal = (game?: Game) => {
    if (game) {
      setEditingGame(game);
      setGameForm({
        name: game.name,
        description: game.description,
        category: game.category,
        gameUrl: game.gameUrl || "",
        thumbnailUrl: game.thumbnailUrl || "",
        maxScore: game.maxScore || 0,
        isActive: game.isActive,
      });
    } else {
      setEditingGame(null);
      setGameForm({
        name: "",
        description: "",
        category: "",
        gameUrl: "",
        thumbnailUrl: "",
        maxScore: 0,
        isActive: true,
      });
    }
    setShowGameModal(true);
  };

  const handleSaveGame = async () => {
    if (editingGame?.id) {
      await updateGame(editingGame.id, gameForm);
      setGames(
        games.map((g) => (g.id === editingGame.id ? { ...g, ...gameForm } : g))
      );
    } else {
      const newGameId = await createGame(gameForm);
      setGames([...games, { id: newGameId, ...gameForm }]);
    }
    setShowGameModal(false);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      await deleteGame(gameId);
      setGames(games.filter((g) => g.id !== gameId));
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden bg-transparent">
      {/* Spline 3D Background */}
      <SplineBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: 'rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#D6E6F3' }}>Admin Panel</h1>
            <p style={{ color: '#A6c5d7' }}>Manage users, games, and settings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: "users" as Tab, label: "Users", icon: FaUsers },
            { id: "games" as Tab, label: "Games", icon: FaGamepad },
            { id: "stats" as Tab, label: "Statistics", icon: FaChartBar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap hover:scale-105"
              style={
                activeTab === tab.id
                  ? { backgroundColor: '#0f52ba', color: '#D6E6F3' }
                  : { backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#A6c5d7' }
              }
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#A6c5d7', borderTopColor: 'transparent' }}></div>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === "users" && (
              <div 
                className="backdrop-blur-xl rounded-2xl p-6"
                style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#D6E6F3' }}>
                  <FaUsers style={{ color: '#0f52ba' }} />
                  User Management ({users.length} users)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(166, 197, 215, 0.2)' }}>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>User</th>
                        <th className="text-left py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Email</th>
                        <th className="text-center py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Games</th>
                        <th className="text-center py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Score</th>
                        <th className="text-center py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Admin</th>
                        <th className="text-right py-3 px-4 font-medium" style={{ color: '#A6c5d7' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr 
                          key={user.uid} 
                          className="transition-colors hover:bg-white/5"
                          style={{ borderBottom: '1px solid rgba(166, 197, 215, 0.1)' }}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt=""
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                  style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
                                >
                                  {user.displayName?.charAt(0) || "?"}
                                </div>
                              )}
                              <span style={{ color: '#D6E6F3' }}>{user.displayName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4" style={{ color: '#A6c5d7' }}>{user.email}</td>
                          <td className="py-3 px-4 text-center" style={{ color: '#D6E6F3' }}>
                            {user.totalGamesPlayed || 0}
                          </td>
                          <td className="py-3 px-4 text-center text-green-400">
                            {user.totalScore?.toLocaleString() || 0}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {user.isAdmin ? (
                              <FaCrown className="text-yellow-400 mx-auto" />
                            ) : (
                              <span style={{ color: '#0f52ba' }}>-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                              className="px-3 py-1 rounded text-sm font-medium transition-all duration-300 hover:scale-105"
                              style={
                                user.isAdmin
                                  ? { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }
                                  : { backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#fbbf24' }
                              }
                            >
                              {user.isAdmin ? "Remove Admin" : "Make Admin"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Games Tab */}
            {activeTab === "games" && (
              <div 
                className="backdrop-blur-xl rounded-2xl p-6"
                style={{ backgroundColor: 'rgba(0, 9, 38, 0.8)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#D6E6F3' }}>
                    <FaGamepad style={{ color: '#0f52ba' }} />
                    Game Management ({games.length} games)
                  </h2>
                  <button
                    onClick={() => handleOpenGameModal()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
                  >
                    <FaPlus />
                    Add Game
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="rounded-xl p-4 transition-all duration-300 hover:scale-105"
                      style={{ 
                        backgroundColor: 'rgba(0, 9, 38, 0.6)', 
                        border: game.isActive ? '1px solid rgba(166, 197, 215, 0.2)' : '1px solid rgba(239, 68, 68, 0.3)',
                        opacity: game.isActive ? 1 : 0.6
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold" style={{ color: '#D6E6F3' }}>{game.name}</h3>
                          <span className="text-xs" style={{ color: '#0f52ba' }}>{game.category}</span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={
                            game.isActive
                              ? { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }
                              : { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }
                          }
                        >
                          {game.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: '#A6c5d7' }}>
                        {game.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenGameModal(game)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                          style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#D6E6F3' }}
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => game.id && handleDeleteGame(game.id)}
                          className="flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
                >
                  <FaUsers className="text-3xl mb-4" style={{ color: '#A6c5d7' }} />
                  <p className="text-sm" style={{ color: '#A6c5d7' }}>Total Users</p>
                  <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>{users.length}</p>
                </div>
                <div 
                  className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
                >
                  <FaGamepad className="text-3xl text-green-400 mb-4" />
                  <p className="text-sm" style={{ color: '#A6c5d7' }}>Active Games</p>
                  <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>
                    {games.filter((g) => g.isActive).length}
                  </p>
                </div>
                <div 
                  className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
                >
                  <FaCrown className="text-3xl text-yellow-400 mb-4" />
                  <p className="text-sm" style={{ color: '#A6c5d7' }}>Admin Users</p>
                  <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>
                    {users.filter((u) => u.isAdmin).length}
                  </p>
                </div>
                <div 
                  className="backdrop-blur-xl rounded-xl p-6 transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgba(0, 9, 38, 0.6)', border: '1px solid rgba(166, 197, 215, 0.2)' }}
                >
                  <FaChartBar className="text-3xl mb-4" style={{ color: '#0f52ba' }} />
                  <p className="text-sm" style={{ color: '#A6c5d7' }}>Total Score</p>
                  <p className="text-3xl font-bold" style={{ color: '#D6E6F3' }}>
                    {users.reduce((acc, u) => acc + (u.totalScore || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Game Modal */}
        {showGameModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div 
              className="rounded-2xl p-6 w-full max-w-lg"
              style={{ backgroundColor: '#000926', border: '1px solid rgba(166, 197, 215, 0.2)' }}
            >
              <h3 className="text-xl font-bold mb-6" style={{ color: '#D6E6F3' }}>
                {editingGame ? "Edit Game" : "Add New Game"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#A6c5d7' }}>Game Name</label>
                  <input
                    type="text"
                    value={gameForm.name}
                    onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2"
                    style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', border: '1px solid rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                    placeholder="Enter game name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#A6c5d7' }}>Description</label>
                  <textarea
                    value={gameForm.description}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg resize-none outline-none focus:ring-2"
                    style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', border: '1px solid rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                    rows={3}
                    placeholder="Enter game description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: '#A6c5d7' }}>Category</label>
                    <input
                      type="text"
                      value={gameForm.category}
                      onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2"
                      style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', border: '1px solid rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                      placeholder="e.g., Arcade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: '#A6c5d7' }}>Max Score</label>
                    <input
                      type="number"
                      value={gameForm.maxScore}
                      onChange={(e) =>
                        setGameForm({ ...gameForm, maxScore: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2"
                      style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', border: '1px solid rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#A6c5d7' }}>Game URL</label>
                  <input
                    type="url"
                    value={gameForm.gameUrl}
                    onChange={(e) => setGameForm({ ...gameForm, gameUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2"
                    style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', border: '1px solid rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#A6c5d7' }}>Thumbnail URL</label>
                  <input
                    type="url"
                    value={gameForm.thumbnailUrl}
                    onChange={(e) => setGameForm({ ...gameForm, thumbnailUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none focus:ring-2"
                    style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', border: '1px solid rgba(166, 197, 215, 0.2)', color: '#D6E6F3' }}
                    placeholder="https://..."
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gameForm.isActive}
                    onChange={(e) => setGameForm({ ...gameForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: '#0f52ba' }}
                  />
                  <span style={{ color: '#D6E6F3' }}>Game is active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGameModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: 'rgba(166, 197, 215, 0.1)', color: '#D6E6F3' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGame}
                  className="flex-1 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: '#0f52ba', color: '#D6E6F3' }}
                >
                  {editingGame ? "Save Changes" : "Create Game"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
