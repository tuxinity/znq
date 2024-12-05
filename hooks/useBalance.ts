import { useState, useEffect } from 'react';

interface Transaction {
  type: string;
  value: number;
  valueToken: number;
  status: string;
  createdAt: string;
}

interface Balances {
  totalValue: number;
  totalValueToken: number;
  transactions: Transaction[];
}

export function useBalances() {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalances() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/balances');
        if (!response.ok) {
          throw new Error('Failed to fetch balances');
        }
        const data = await response.json();
        setBalances(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setBalances(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalances();
  }, []);

  return { balances, isLoading, error };
}

