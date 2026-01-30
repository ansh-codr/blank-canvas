export { auth, db, googleProvider } from "./config";
export {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  resetPassword,
} from "./auth";
export {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  createGame,
  addGame,
  getGames,
  getActiveGames,
  getGame,
  getGameById,
  updateGame,
  deleteGame,
  incrementPlayCount,
  submitScore,
  addScore,
  getUserScores,
  getLeaderboard,
  getGameLeaderboard,
  getGlobalLeaderboard,
  getAllUsers,
  setUserAdmin,
} from "./firestore";
export type { UserProfile, Game, Score } from "./firestore";
