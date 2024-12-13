"use client";

import Image from "next/image";
import { useBalances } from "@/hooks/useBalance";
import { Skeleton } from "@/components/ui/skeleton";
import { useTokenPurchase } from "@/hooks/useTokenPurchase";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTransactions } from "@/hooks/useTransactions";
import { useFetchUsers } from "@/hooks/useUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function UserBalanceCard() {
  const user = useCurrentUser();
  const { isLoading: balancesLoading, balances } = useBalances();
  const { tokenPrice, error, prevPrice, isLoading } = useTokenPurchase();
  const { omzet } = useTransactions();
  const { totalUser } = useFetchUsers(1, 10);

  const priceChange =
    tokenPrice !== null && prevPrice !== null ? tokenPrice - prevPrice : null;
  const priceChangePercentage =
    priceChange !== null && prevPrice !== null
      ? (priceChange / prevPrice) * 100
      : null;

  const formatPrice = (price: number | null) => {
    if (price === null) return "-.--";
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const calculateTokenAmount = () => {
    if (!balances || !tokenPrice) return "0";
    return (Number(balances.totalValueToken) * tokenPrice).toFixed(2);
  };

  return (
    <Card className="bg-slate-800 text-white border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl font-bold">
          Balance Information
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-400">
          Your ZENQ token details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {isLoading ? (
          <Skeleton className="h-9 w-full bg-gray-400" />
        ) : error ? (
          <p className="text-xs sm:text-sm text-destructive">{error}</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-2xl sm:text-3xl font-bold ${
                    priceChange! >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatPrice(tokenPrice)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  ZENQ Token Price
                </p>
              </div>
              {priceChange !== null && (
                <div
                  className={`flex items-center ${
                    priceChange >= 0 ? "text-green-500" : "text-red-500"
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
        <div className="flex items-center justify-between ">
          <div className="flex flex-row space-x-2 sm:space-x-4 item-center">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12">
            <Image
              src="/zenq.svg"
              alt="ZENQ token"
              fill
              sizes="(max-width: 640px) 32px, 48px"
              className="object-contain mt-5"
              priority
            />
          </div>
          <div>
            {balancesLoading ? (
              <Skeleton className="h-9 w-[120px] bg-gray-400" />
            ) : (
              <p className="text-xl sm:text-2xl font-bold">
                {user?.role === "ADMIN" ? formatPrice(omzet ?? 0) : formatPrice(balances?.totalValueToken ?? 0)}
              </p>
            )}

            <p className="text-xs sm:text-sm text-muted-foreground">
              {user?.role === "ADMIN" ?
                "Total ZENQ Omzet"
              :
                "ZENQ Balance"
              }
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground text-white">
              ≈ {calculateTokenAmount()} USDT
            </p>
          </div>
          </div>
          {user?.role === "ADMIN" && (
          <div className="flex flex-col items-center sm:items-start space-y-2 ml-10">
            <h1 className="text-lg sm:text-2xl font-semibold text-white">
              {totalUser}
            </h1>
            <p className="text-md font-bold text-white">
              Total User
            </p>
          </div>
        )}
        </div>
        
      </CardContent>
    </Card>
  );
}
