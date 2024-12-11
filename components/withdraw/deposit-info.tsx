"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTokenPurchase } from "@/hooks/useTokenPurchase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react";
import { SiBinance } from "react-icons/si";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { CustomToast } from "./toast";
import { useTransactions } from "@/context/TransactionContext";
import { useBalances } from "@/hooks/useBalance";

export function DepositInfo() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("USDT.BEP20");
  const { isLoading: balancesLoading, balances } = useBalances();
  const { tokenPrice, error, prevPrice, isLoading, buyError } = useTokenPurchase();
  const { postWithdrawal, success, response, loading, refetch } = useTransactions();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");


  const priceChange = tokenPrice !== null && prevPrice !== null ? tokenPrice - prevPrice : null;
  const priceChangePercentage =
    priceChange !== null && prevPrice !== null ? (priceChange / prevPrice) * 100 : null;

  const formatPrice = (price: number | null) => {
    if (price === null) return "$-.--";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

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
    <div className="mx-auto p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 md:mt-10">
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="bg-slate-800 text-white border-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-bold">Balance Information</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-400">
              Your ZENQ token details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {isLoading ? (
              <p className="text-xs sm:text-sm text-muted-foreground">Loading price...</p>
            ) : error ? (
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-2xl sm:text-3xl font-bold ${priceChange! >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {formatPrice(tokenPrice)}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">ZENQ Token Price</p>
                  </div>
                  {priceChange !== null && (
                    <div
                      className={`flex items-center ${priceChange >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {priceChange >= 0 ? (
                        <ArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">
                        {priceChangePercentage?.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                <Image
                  src="/zenq.svg"
                  alt="ZENQ token"
                  fill
                  sizes="(max-width: 640px) 32px, 48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
              {balancesLoading ? (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Loading balances...
                  </p>
                ) : (
                <p className="text-xl sm:text-2xl font-bold">{formatPrice(balances?.totalValueToken ?? 0)}</p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground">ZENQ Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-slate-800 text-white border-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-lg sm:text-2xl font-bold">Withdraw ZENQ Tokens Value</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-400">
              Withdraw ZENQ tokens in USDT
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
                {
                  paymentMethod === "BNB" ? (
                    <SiBinance className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  ) : (
                    <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  )
                }
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
            <Select onValueChange={(value) => setPaymentMethod(value)}>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="USDT.BEP20">USDT.BEP20</SelectItem>
                  <SelectItem value="USDT.TRC20">USDT.TRC20</SelectItem>
                  <SelectItem value="BNB">BNB</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              className="w-full bg-blue-800 hover:bg-blue-900 text-xs sm:text-sm"
              onClick={() => postWithdrawal(Number(amount))}
              disabled={!amount || loading || isLoading || !!error}
            >
              {isLoading ? "Processing..." : "Withdraw ZENQ"}
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
