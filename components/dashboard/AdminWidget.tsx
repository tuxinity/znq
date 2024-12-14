'use client'

import { useTransactions } from "@/hooks/useTransactions";
import { useFetchUsers } from "@/hooks/useUsers";
import { BeatLoader } from "react-spinners";

export function AdminWidget() {
  const { totalUser } = useFetchUsers(1, 1);
  const { omzet } = useTransactions();

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-row justify-center gap-8 bg-white shadow-lg p-5 rounded-xl">
        <div className="w-1/2 bg-gradient-to-r table from-blue-500 to-purple-600 text-white p-4 rounded-xl">
          <h2 className="text-2xl table-cell">Total ZENQ User</h2>
          <p className="text-2xl font-bold table-cell text-right">{omzet ? `$${omzet}` : <BeatLoader />}</p>
        </div>
        <div className="w-1/2 bg-gradient-to-r table from-blue-500 to-purple-600 text-white p-4 rounded-xl">
          <h2 className="text-2xl">Total User</h2>
          <p className="text-2xl font-bold table-cell text-right">{totalUser ?? <BeatLoader />}</p>
        </div>
      </div>
    </div>
  )
}