import { useEffect, useState } from "react";

export const usePaymentStatus = (txnId: string) => {
  const [statusText, setStatusText] = useState<string | null>(null);
  const [signal, setSignal] = useState(0)

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txnId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/payment-status?txnid=${txnId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment status");
        }
        const data = await response.json();


        setSignal(data.data.coinpaymentsStatus.status);
        setStatusText(data.data.transaction.status);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch payment status"
        );
        console.error("Error fetching status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [txnId]);

  return { statusText, error, signal };
};