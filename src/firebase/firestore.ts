import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Date | Timestamp;
  isAdmin: boolean;
  totalGamesPlayed?: number;
  totalScore?: number;
}

export interface Game {
  id?: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  gameUrl?: string;
  category: string;
  isActive: boolean;
  createdAt?: Date | Timestamp;
  playCount?: number;
  maxScore?: number;
}

export interface Score {
  id?: string;
  userId: string;
  displayName: string;
  gameId: string;
  gameName: string;
  score: number;
  createdAt: Date | Timestamp;
}

// User Profile Functions
export const createUserProfile = async (
  userId: string,
  profile: Omit<UserProfile, "uid">
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...profile,
    uid: userId,
    createdAt: serverTimestamp(),
    totalGamesPlayed: 0,
    totalScore: 0,
  });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? ({ uid: userId, ...userSnap.data() } as UserProfile) : null;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, updates);
};

// Game Functions
export const createGame = async (game: Omit<Game, "id" | "createdAt" | "playCount">): Promise<string> => {
  const gamesRef = collection(db, "games");
  const docRef = await addDoc(gamesRef, {
    ...game,
    createdAt: serverTimestamp(),
    playCount: 0,
  });
  return docRef.id;
};

// Alias for createGame
export const addGame = createGame;

export const getGames = async (activeOnly: boolean = false): Promise<Game[]> => {
  const gamesRef = collection(db, "games");
  const snapshot = await getDocs(gamesRef);
  const games = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Game));
  return activeOnly ? games.filter(g => g.isActive) : games;
};

export const getActiveGames = async (): Promise<Game[]> => {
  return getGames(true);
};

export const getGame = async (gameId: string): Promise<Game | null> => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  return gameSnap.exists() ? ({ id: gameSnap.id, ...gameSnap.data() } as Game) : null;
};

// Alias for getGame
export const getGameById = getGame;

export const updateGame = async (gameId: string, updates: Partial<Game>): Promise<void> => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, updates);
};

export const deleteGame = async (gameId: string): Promise<void> => {
  const gameRef = doc(db, "games", gameId);
  await deleteDoc(gameRef);
};

export const incrementPlayCount = async (gameId: string): Promise<void> => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  if (gameSnap.exists()) {
    const currentCount = gameSnap.data().playCount || 0;
    await updateDoc(gameRef, { playCount: currentCount + 1 });
  }
};

// Score Functions
export const submitScore = async (scoreData: {
  gameId: string;
  gameName: string;
  score: number;
  userId: string;
  displayName: string;
}): Promise<string> => {
  const scoresRef = collection(db, "scores");
  const docRef = await addDoc(scoresRef, {
    ...scoreData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Legacy alias for submitScore
export const addScore = async (
  userId: string,
  userDisplayName: string,
  gameId: string,
  gameName: string,
  score: number
): Promise<void> => {
  await submitScore({ userId, displayName: userDisplayName, gameId, gameName, score });

  // Update user stats
  const userProfile = await getUserProfile(userId);
  if (userProfile) {
    await updateUserProfile(userId, {
      totalGamesPlayed: (userProfile.totalGamesPlayed || 0) + 1,
      totalScore: (userProfile.totalScore || 0) + score,
    });
  }
};

export const getUserScores = async (userId: string): Promise<Score[]> => {
  const scoresRef = collection(db, "scores");
  const q = query(
    scoresRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Score));
};

export const getLeaderboard = async (gameId: string, limitCount: number = 10): Promise<Score[]> => {
  const scoresRef = collection(db, "scores");
  const q = query(
    scoresRef,
    where("gameId", "==", gameId),
    orderBy("score", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Score));
};

// Alias for getLeaderboard
export const getGameLeaderboard = getLeaderboard;

export const getGlobalLeaderboard = async (limitCount: number = 10): Promise<Score[]> => {
  const scoresRef = collection(db, "scores");
  const q = query(scoresRef, orderBy("score", "desc"), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Score));
};

// Admin Functions
export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as UserProfile));
};

export const setUserAdmin = async (userId: string, isAdmin: boolean): Promise<void> => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { isAdmin });
};
