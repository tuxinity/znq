import { useEffect, useState } from "react";

export const usePaymentStatus = (txnId: string) => {
  const [statusText, setStatusText] = useState<string | null>(null);
  const [signal, setSignal] = useState(0)

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txnId) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/payment-status?txn_id=${txnId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment status");
        }
        const data = await response.json();

        setSignal(data.status);
        setStatusText(data.status_text);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch payment status"
        );
        console.error("Error fetching status:", err);
      }
    };

    // Poll every 30 seconds
    fetchStatus();
    const interval = setInterval(fetchStatus, 600000);

    return () => clearInterval(interval);
  }, [txnId]);

  return { statusText, error, signal };
};