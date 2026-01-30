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
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-violet-300">Manage users, games, and settings</p>
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white"
                  : "bg-white/10 text-violet-300 hover:bg-white/20"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-violet-300 py-12">Loading...</div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaUsers className="text-violet-400" />
                  User Management ({users.length} users)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-4 text-violet-300 font-medium">User</th>
                        <th className="text-left py-3 px-4 text-violet-300 font-medium">Email</th>
                        <th className="text-center py-3 px-4 text-violet-300 font-medium">Games</th>
                        <th className="text-center py-3 px-4 text-violet-300 font-medium">Score</th>
                        <th className="text-center py-3 px-4 text-violet-300 font-medium">Admin</th>
                        <th className="text-right py-3 px-4 text-violet-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.uid} className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt=""
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm">
                                  {user.displayName?.charAt(0) || "?"}
                                </div>
                              )}
                              <span className="text-white">{user.displayName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-violet-300">{user.email}</td>
                          <td className="py-3 px-4 text-center text-white">
                            {user.totalGamesPlayed || 0}
                          </td>
                          <td className="py-3 px-4 text-center text-green-400">
                            {user.totalScore?.toLocaleString() || 0}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {user.isAdmin ? (
                              <FaCrown className="text-yellow-400 mx-auto" />
                            ) : (
                              <span className="text-violet-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                              className={`px-3 py-1 rounded text-sm font-medium transition ${
                                user.isAdmin
                                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                              }`}
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
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaGamepad className="text-violet-400" />
                    Game Management ({games.length} games)
                  </h2>
                  <button
                    onClick={() => handleOpenGameModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
                  >
                    <FaPlus />
                    Add Game
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className={`bg-white/5 rounded-xl p-4 border ${
                        game.isActive ? "border-white/20" : "border-red-500/30 opacity-60"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-white">{game.name}</h3>
                          <span className="text-xs text-violet-400">{game.category}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            game.isActive
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {game.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-sm text-violet-300 mb-4 line-clamp-2">
                        {game.description}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenGameModal(game)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => game.id && handleDeleteGame(game.id)}
                          className="flex items-center justify-center px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
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
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <FaUsers className="text-3xl text-blue-400 mb-4" />
                  <p className="text-violet-300 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <FaGamepad className="text-3xl text-green-400 mb-4" />
                  <p className="text-violet-300 text-sm">Active Games</p>
                  <p className="text-3xl font-bold text-white">
                    {games.filter((g) => g.isActive).length}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <FaCrown className="text-3xl text-yellow-400 mb-4" />
                  <p className="text-violet-300 text-sm">Admin Users</p>
                  <p className="text-3xl font-bold text-white">
                    {users.filter((u) => u.isAdmin).length}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <FaChartBar className="text-3xl text-purple-400 mb-4" />
                  <p className="text-violet-300 text-sm">Total Score</p>
                  <p className="text-3xl font-bold text-white">
                    {users.reduce((acc, u) => acc + (u.totalScore || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Game Modal */}
        {showGameModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingGame ? "Edit Game" : "Add New Game"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-violet-300 mb-1">Game Name</label>
                  <input
                    type="text"
                    value={gameForm.name}
                    onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Enter game name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-violet-300 mb-1">Description</label>
                  <textarea
                    value={gameForm.description}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
                    rows={3}
                    placeholder="Enter game description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-violet-300 mb-1">Category</label>
                    <input
                      type="text"
                      value={gameForm.category}
                      onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder="e.g., Arcade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-violet-300 mb-1">Max Score</label>
                    <input
                      type="number"
                      value={gameForm.maxScore}
                      onChange={(e) =>
                        setGameForm({ ...gameForm, maxScore: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-violet-300 mb-1">Game URL</label>
                  <input
                    type="url"
                    value={gameForm.gameUrl}
                    onChange={(e) => setGameForm({ ...gameForm, gameUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-violet-300 mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={gameForm.thumbnailUrl}
                    onChange={(e) => setGameForm({ ...gameForm, thumbnailUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="https://..."
                  />
                </div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={gameForm.isActive}
                    onChange={(e) => setGameForm({ ...gameForm, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20"
                  />
                  <span className="text-white">Game is active</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGameModal(false)}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGame}
                  className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition"
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
