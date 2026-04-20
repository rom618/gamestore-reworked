import { useState, useEffect } from "react";
import { reviewsApi } from "../api/reviews";
import type { Review } from "../types";

interface UseReviewsResult {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useReviews(gameId: number): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (!gameId) return;
    let cancelled = false;

    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await reviewsApi.getByGame(gameId);
        if (!cancelled) setReviews(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchReviews();
    return () => { cancelled = true; };
  }, [gameId, trigger]);

  return { reviews, isLoading, error, refetch: () => setTrigger((t) => t + 1) };
}