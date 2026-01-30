import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { Game } from "./firestore";

// Default games that should always exist
const DEFAULT_GAMES: Omit<Game, "id" | "createdAt" | "playCount">[] = [
  {
    name: "Neon Snake",
    description: "Classic snake game with neon graphics! Navigate the snake, eat food to grow, and try to beat your high score.",
    category: "arcade",
    gameUrl: "/games/snake",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Tic Tac Toe",
    description: "Classic strategy game vs intelligent AI! Choose your difficulty from Easy, Medium, or Hard and prove you're unbeatable.",
    category: "puzzle",
    gameUrl: "/games/tictactoe",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Memory Match",
    description: "Test your memory with this card matching game! Flip cards, find pairs, and challenge yourself with 3 difficulty levels.",
    category: "puzzle",
    gameUrl: "/games/memory",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Rock Paper Scissors",
    description: "The ultimate battle of wits! Challenge the AI in Best of 3, Best of 5, or Endless mode. Build your winning streak!",
    category: "arcade",
    gameUrl: "/games/rps",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
];

// Game ID mapping for scores
export const GAME_ID_MAP: Record<string, string> = {
  "neon-snake": "",
  "tic-tac-toe": "",
  "memory-match": "",
  "rock-paper-scissors": "",
};

export const seedDefaultGames = async (): Promise<void> => {
  try {
    const gamesRef = collection(db, "games");
    
    const slugMap: Record<string, string> = {
      "Neon Snake": "neon-snake",
      "Tic Tac Toe": "tic-tac-toe",
      "Memory Match": "memory-match",
      "Rock Paper Scissors": "rock-paper-scissors",
    };
    
    for (const game of DEFAULT_GAMES) {
      // Check if game already exists by name
      const q = query(gamesRef, where("name", "==", game.name));
      const snapshot = await getDocs(q);
      
      const slug = slugMap[game.name];
      
      if (snapshot.empty) {
        // Game doesn't exist, create it
        const docRef = await addDoc(gamesRef, {
          ...game,
          createdAt: serverTimestamp(),
          playCount: 0,
        });
        console.log(`✅ Seeded game: ${game.name} with ID: ${docRef.id}`);
        
        // Update ID map
        if (slug) {
          GAME_ID_MAP[slug] = docRef.id;
        }
      } else {
        // Game exists, get its ID
        const existingGame = snapshot.docs[0];
        if (slug) {
          GAME_ID_MAP[slug] = existingGame.id;
        }
        console.log(`ℹ️ Game already exists: ${game.name} with ID: ${existingGame.id}`);
      }
    }
  } catch (error) {
    console.error("Error seeding games:", error);
  }
};

// Get game ID by slug
export const getGameIdBySlug = async (slug: string): Promise<string | null> => {
  // Check cache first
  if (GAME_ID_MAP[slug]) {
    return GAME_ID_MAP[slug];
  }
  
  // Map slug to game name
  const nameMap: Record<string, string> = {
    "neon-snake": "Neon Snake",
    "tic-tac-toe": "Tic Tac Toe",
    "memory-match": "Memory Match",
    "rock-paper-scissors": "Rock Paper Scissors",
  };
  
  const gameName = nameMap[slug];
  if (!gameName) return null;
  
  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("name", "==", gameName));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const gameId = snapshot.docs[0].id;
      GAME_ID_MAP[slug] = gameId;
      return gameId;
    }
  } catch (error) {
    console.error("Error getting game ID:", error);
  }
  
  return null;
};
