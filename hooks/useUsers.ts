import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

interface UseFetchUsersResult {
  users: User[];
  totalPages: number;
  currentPage: number;
  totalUser: number | null;
  loading: boolean;
  error: string | null;
}

export const useFetchUsers = (page: number, limit: number): UseFetchUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [totalUser, setTotalUser] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/user?page=${page}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        const { users, totalPages, currentPage, totalRecords } = data;

        setUsers(users);
        setTotalPages(totalPages);
        setCurrentPage(currentPage);
        setTotalUser(totalRecords || null); // Only set totalRecords if provided
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit]);

  return { users, totalPages, currentPage, totalUser, loading, error };
};
