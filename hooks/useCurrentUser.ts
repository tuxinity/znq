import useSWR from "swr";
import { User } from "@prisma/client";

const fetcher = (url: string) =>
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .catch(error => {
      console.error("Error in fetcher:", error);
      throw error;
    });

export function useCurrentUser() {
  const { data, error, isLoading } = useSWR<{ user: User | null }>(
    "/api/current-user",
    fetcher
  );

  return {
    user: data?.user,
    isLoading,
    isError: !!error,
  };
}
