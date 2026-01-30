import { useState, useEffect, useCallback } from "react";
import {
  getActiveGames,
  getGame,
  createGame,
  updateGame,
  Game,
} from "@/firebase";

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const activeGames = await getActiveGames();
      setGames(activeGames);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, error, refetch: fetchGames };
};

export const useGame = (gameId: string | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) {
        setGame(null);
        return;
      }

      try {
        setLoading(true);
        const fetchedGame = await getGame(gameId);
        setGame(fetchedGame);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch game");
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  return { game, loading, error };
};

export const useGameManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGame = async (gameData: Omit<Game, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const gameId = await createGame(gameData);
      return gameId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create game";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editGame = async (gameId: string, gameData: Partial<Game>) => {
    try {
      setLoading(true);
      setError(null);
      await updateGame(gameId, gameData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update game";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { addGame, editGame, loading, error };
};
