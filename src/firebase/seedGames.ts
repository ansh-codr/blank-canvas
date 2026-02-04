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
  {
    name: "Coin Flip",
    description: "Heads or tails? Flip the coin and test your luck in one tap.",
    category: "casual",
    gameUrl: "/games/coin-flip",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Dice Roll",
    description: "Roll the dice and chase your luckiest streak.",
    category: "casual",
    gameUrl: "/games/dice-roll",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Number Guess",
    description: "Guess the hidden number between 1 and 100 in as few tries as possible.",
    category: "puzzle",
    gameUrl: "/games/number-guess",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Color Match",
    description: "Match the target color quickly to keep your streak alive.",
    category: "arcade",
    gameUrl: "/games/color-match",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Quick Tap",
    description: "Tap as fast as you can before the timer runs out.",
    category: "arcade",
    gameUrl: "/games/quick-tap",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Reaction Time",
    description: "Wait for green, then click as fast as possible.",
    category: "arcade",
    gameUrl: "/games/reaction-time",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Word Scramble",
    description: "Unscramble words to build your streak.",
    category: "puzzle",
    gameUrl: "/games/word-scramble",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Pattern Memory",
    description: "Repeat the sequence and level up your memory.",
    category: "puzzle",
    gameUrl: "/games/pattern-memory",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Lights Out",
    description: "Toggle tiles to turn off every light.",
    category: "puzzle",
    gameUrl: "/games/lights-out",
    thumbnailUrl: "",
    maxScore: 0,
    isActive: true,
  },
  {
    name: "Emoji Hunt",
    description: "Find the odd emoji and score quick points.",
    category: "casual",
    gameUrl: "/games/emoji-hunt",
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
  "coin-flip": "",
  "dice-roll": "",
  "number-guess": "",
  "color-match": "",
  "quick-tap": "",
  "reaction-time": "",
  "word-scramble": "",
  "pattern-memory": "",
  "lights-out": "",
  "emoji-hunt": "",
};

export const seedDefaultGames = async (): Promise<void> => {
  try {
    const gamesRef = collection(db, "games");
    
    const slugMap: Record<string, string> = {
      "Neon Snake": "neon-snake",
      "Tic Tac Toe": "tic-tac-toe",
      "Memory Match": "memory-match",
      "Rock Paper Scissors": "rock-paper-scissors",
      "Coin Flip": "coin-flip",
      "Dice Roll": "dice-roll",
      "Number Guess": "number-guess",
      "Color Match": "color-match",
      "Quick Tap": "quick-tap",
      "Reaction Time": "reaction-time",
      "Word Scramble": "word-scramble",
      "Pattern Memory": "pattern-memory",
      "Lights Out": "lights-out",
      "Emoji Hunt": "emoji-hunt",
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
    "coin-flip": "Coin Flip",
    "dice-roll": "Dice Roll",
    "number-guess": "Number Guess",
    "color-match": "Color Match",
    "quick-tap": "Quick Tap",
    "reaction-time": "Reaction Time",
    "word-scramble": "Word Scramble",
    "pattern-memory": "Pattern Memory",
    "lights-out": "Lights Out",
    "emoji-hunt": "Emoji Hunt",
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
