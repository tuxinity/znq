import { useState, useEffect, useCallback } from "react";

interface Transaction {
  id: string;
  txnId: string;
  userId: string;
  value: number;
  valueToken: number;
  type: string;
  status: string;
  reference: string;
  createdAt: number;
  user: {
    email: string;
  };
}

interface UseTransactionsResult {
  transactions: Transaction[] | null;
  transaction: Transaction | null;
  loading: boolean;
  error: string | null;
  fetchById: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const useTransactions = (): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/token-crypt/transaction?page=${currentPage}&limit=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const { transactions, totalPages, currentPage: current } = await response.json();

      setTransactions(transactions);
      setTotalPages(totalPages);
      setCurrentPage(current);
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/transaction/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data: Transaction = await response.json();
        setTransaction(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch transaction");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setError("Invalid page number");
    }
  };

  return {
    transactions,
    transaction,
    loading,
    error,
    fetchById,
    refetch: fetchTransactions,
    currentPage,
    totalPages,
    setPage,
  };
};
