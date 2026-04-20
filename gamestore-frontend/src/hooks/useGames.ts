import { useState, useEffect } from "react";
import { gamesApi } from "../api/games";
import type { Game } from "../types";

interface UseGamesResult {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGames(): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchGames = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await gamesApi.getAll();
        if (!cancelled) setGames(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchGames();
    return () => { cancelled = true; };
  }, [trigger]);

  return { games, isLoading, error, refetch: () => setTrigger((t) => t + 1) };
}