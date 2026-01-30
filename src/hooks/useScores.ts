import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts";
import {
  submitScore,
  getUserScores,
  getLeaderboard,
  Score,
  updateUserProfile,
} from "@/firebase";

export const useScores = () => {
  const { user, userProfile } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    if (!user) {
      setScores([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userScores = await getUserScores(user.uid);
      setScores(userScores);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch scores");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const addScore = async (gameId: string, gameName: string, score: number) => {
    if (!user || !userProfile) {
      throw new Error("User must be logged in to submit scores");
    }

    try {
      setLoading(true);
      setError(null);

      // Submit the score
      await submitScore({
        gameId,
        gameName,
        score,
        userId: user.uid,
        displayName: userProfile.displayName,
      });

      // Update user's total score and games played
      const newTotalScore = (userProfile.totalScore || 0) + score;
      const newGamesPlayed = (userProfile.totalGamesPlayed || 0) + 1;

      await updateUserProfile(user.uid, {
        totalScore: newTotalScore,
        totalGamesPlayed: newGamesPlayed,
      });

      // Refresh scores
      await fetchScores();

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit score";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { scores, loading, error, addScore, refetch: fetchScores };
};

export const useLeaderboard = (gameId: string | null, limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!gameId) {
      setLeaderboard([]);
      return;
    }

    try {
      setLoading(true);
      const scores = await getLeaderboard(gameId, limit);
      setLeaderboard(scores);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  }, [gameId, limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { leaderboard, loading, error, refetch: fetchLeaderboard };
};
