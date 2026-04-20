import { useState, useEffect } from "react";
import { gamesApi } from "../api/games";
import type { Game } from "../types";

interface UseGameResult {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
}

export function useGame(id: number): UseGameResult {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetchGame = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await gamesApi.getById(id);
        if (!cancelled) setGame(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load game");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchGame();
    return () => { cancelled = true; };
  }, [id]);

  return { game, isLoading, error };
}