"use client";

import { useEffect, useState } from "react";
import { useTokenPurchase } from "@/hooks/useTokenPurchase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomToast } from "./toast";
import { useTransactions } from "@/context/TransactionContext";
import { UserBalanceCard } from "../card";

export function DepositInfo() {
  const [amount, setAmount] = useState("");
  const { tokenPrice, error, isLoading, buyError } = useTokenPurchase();
  const { postWithdrawal, success, response, loading, refetch } = useTransactions();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const calculateTokenAmount = () => {
    if (!amount || !tokenPrice) return "0";

    return (Number(amount) * tokenPrice).toFixed(6);
  };

  useEffect(() => {
    if (success) {
      setToastMessage("Withdraw Requested!");
      setShowToast(true);
      setAmount("")
      refetch()
    } else {
      setToastMessage(response?.error || "Error occurred");
      setShowToast(true);
      setAmount("")
    }
  }, [success]);

  return (
    <div className="mx-auto p-4 sm:p-6 md:p-5 mt-4 sm:mt-6 md:mt-10">
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-3">
        <UserBalanceCard />

        <Card className="md:col-span-2 bg-slate-800 text-white border-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl font-bold">Withdraw Funds</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-400">
              Withdraw ZENQ tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Enter amount in ZENQ"
                  value={amount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
                      setAmount(inputValue);
                    }
                  }}
                  className="pr-12 text-xs sm:text-sm"
                />

                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />

              </div>
              {buyError && <p className="text-xs sm:text-sm text-destructive">{buyError}</p>}
              {tokenPrice && amount && (
                <p className="text-xs sm:text-sm text-muted-foreground text-white">
                  ≈ {calculateTokenAmount()} ZENQ
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-5">
            <Button
              className="w-full bg-blue-800 hover:bg-blue-900 text-xs sm:text-sm"
              onClick={() => postWithdrawal(Number(amount))}
              disabled={!amount || loading || isLoading || !!error}
            >
              {isLoading ? "Processing..." : "Buy ZENQ"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {showToast && (
        <CustomToast
          status={success ? "success" : "error"}
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

export default DepositInfo;
