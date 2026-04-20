import { useState, useEffect } from "react";
import { transactionApi } from "../api/transactions";
import type { Transaction } from "../types";

interface UseTransactionsResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTransactions(customerId: number | undefined): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (!customerId) return;
    let cancelled = false;

    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await transactionApi.getByCustomer(customerId);
        if (!cancelled) setTransactions(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load transactions");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchTransactions();
    return () => { cancelled = true; };
  }, [customerId, trigger]);

  return { transactions, isLoading, error, refetch: () => setTrigger((t) => t + 1) };
}