import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export interface Transaction {
  id: string;
  txnId: string;
  value: number;
  valueToken: number;
  type: string;
  status: string;
  reference: string;
  createdAt: Date;
  user?: {
    email: string;
  };
}

interface UseTransactionsHook {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  omzet: number;
  refetch: (page?: number) => void;
}

export const useTransactions = (
  initialPage: number = 1,
  pageLimit: number = 10
): UseTransactionsHook => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [omzet, setOmzet] = useState<number>(0);

  const fetchTransactions = async (pageToFetch: number = page) => {
    if (!session?.user) {
      setError(new Error('No authenticated user'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/transaction?page=${pageToFetch}&limit=${pageLimit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setPage(data.currentPage);
      setOmzet(data.totalTransactionValue)
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [session?.user, page]);

  const refetch = (pageNumber?: number) => {
    if (pageNumber) {
      setPage(pageNumber);
    }
    fetchTransactions();
  };

  return {
    transactions,
    isLoading,
    error,
    totalPages,
    currentPage,
    omzet,
    refetch,
  };
};