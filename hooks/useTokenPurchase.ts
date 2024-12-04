import { useState, useEffect } from "react";

interface TransactionStatusHook {
  tokenPriceUSD: number | null;
  tokenPriceBNB: number | null;
  prevPriceUSD: number | null;
  prevPriceBNB: number | null;
  isLoading: boolean;
  error: string | null;
  buyError: string | null;
  handleBuy: (amount: number, paymentMethod: string) => Promise<void>;
}

export const useTokenPurchase = (): TransactionStatusHook => {
  const [tokenPriceUSD, setTokenPriceUSD] = useState<number | null>(null);
  const [prevPriceUSD, setPrevPriceUSD] = useState<number | null>(null);
  const [tokenPriceBNB, setTokenPriceBNB] = useState<number | null>(null);
  const [prevPriceBNB, setPrevPriceBNB] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const responseUSD = await fetch("/api/usd");
        const responseBNB = await fetch("/api/bnb");

        if (!responseUSD.ok || !responseBNB.ok) {
          throw new Error("Failed to fetch token prices");
        }

        const dataUSD = await responseUSD.json();
        const dataBNB = await responseBNB.json();

        if (dataUSD.stats && dataUSD.stats.length > 0 && dataBNB.stats && dataBNB.stats.length > 0) {
          const currentPriceUSD = dataUSD.stats[dataUSD.stats.length - 1][1];
          const previousPriceUSD = dataUSD.stats[dataUSD.stats.length - 2][1];
          const currentPriceBNB = dataBNB.stats[dataBNB.stats.length - 1][1];
          const previousPriceBNB = dataBNB.stats[dataBNB.stats.length - 2][1];

          setTokenPriceUSD(currentPriceUSD);
          setPrevPriceUSD(previousPriceUSD);
          setTokenPriceBNB(currentPriceBNB);
          setPrevPriceBNB(previousPriceBNB);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch price data"
        );
        console.error("Error fetching price:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenPrice();
    const interval = setInterval(fetchTokenPrice, 60000); // Refresh prices every minute

    return () => clearInterval(interval);
  }, []);

  const handleBuy = async (amount: number, paymentMethod: string) => {
    if (!amount || amount <= 0 || !tokenPriceUSD || !tokenPriceBNB) return;

    if (amount < 0.2 && paymentMethod !== "BNB") {
      setBuyError("The amount must be at least 0.2 USDT.");
      return;
    }

    const valueToken =
      paymentMethod === "BNB"
        ? Number((Number(amount) / tokenPriceBNB!).toFixed(6)) // Use BNB token price
        : Number((Number(amount) / tokenPriceUSD!).toFixed(6)); // Use USD token price

    try {
      const response = await fetch("/api/coinpayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          valueToken,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transaction failed");
      }

      const paymentData = await response.json();

      window.open(paymentData.status, "_blank");
    } catch (err) {
      console.error("Error during purchase:", err);
      setBuyError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  return {
    tokenPriceUSD,
    prevPriceUSD,
    tokenPriceBNB,
    prevPriceBNB,
    isLoading,
    error,
    buyError,
    handleBuy,
  };
};
