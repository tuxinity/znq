"use client"

import React, { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import Link from "next/link";
import Table from "../ui/table";
import { Badge } from "../ui/badge";
import Pagination from "../pagination";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { TransactionProvider, useTransactions } from "@/context/TransactionContext";
import { ModalWithdraw } from "../withdraw/modal-transaction";
import { Input } from "../ui";
import { Search } from "lucide-react";

export interface IUserTransaction {
  id: string;
  txHash: string;
  email: string;
  transactionDate: string;
  amount: number;
  status: string;
  reference: string;
  action: () => void;
}

const columnHelper = createColumnHelper<IUserTransaction>();

export const TableAdminWithdraw = () => {
    const { withdrawals, withdraw, fetchById } = useTransactions();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    console.log("withdraw", withdraw)

  const handleOpenTransaction = async (id: string) => {
    await fetchById(id);
    setModalOpen(true);
  };

  const columns = useMemo(() => [
    columnHelper.accessor("transactionDate", {
      cell: info => (
        <div className="min-w-[5rem] font-bold text-sm capitalize text-center">
          {info.getValue()}
        </div>
      ),
      header: () => <div>Date</div>,
    }),
    columnHelper.accessor("email", {
        cell: info => (
          <div className="min-w-[5rem] font-bold text-sm capitalize text-center">
            {info.getValue()}
          </div>
        ),
        header: () => <div>user</div>,
      }),
    columnHelper.accessor("txHash", {
      cell: info => (
        <div className="min-w-[13rem] font-bold text-md capitalize text-center">
          {info.getValue()}
        </div>
      ),
      header: () => <div className="text-center">txHash</div>,
    }),
    columnHelper.accessor("amount", {
      cell: info => (
        <div className="min-w-[13rem] font-bold text-md capitalize text-center">
          {info.getValue()}
        </div>
      ),
      header: () => <div className="text-center">ZENQ Asset</div>,
    }),
    columnHelper.accessor("status", {
      cell: info => {
        const txn = info.row.original.txHash;
        return <TransactionStatusCell txnId={txn} />;
      },
      header: () => <div className="text-center">Status</div>,
    }),
    columnHelper.accessor("reference", {
      cell: info => (
        <Link href={info.row.original.reference}>
          <div className="min-w-[13rem] font-bold text-md text-center hover:text-blue-700">
            {info.getValue().slice(0, 20) + "..."}
          </div>
        </Link>
      ),
      header: () => <div className="text-center">Reference</div>,
    }),
    columnHelper.accessor("action", {
        cell: (info) => {
          const rowId = info.row.original.id;
          return (
            <button
              onClick={() => handleOpenTransaction(rowId as string)}
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Withdraw
            </button>
          );
        },
        header: () => <div className="text-center">Action</div>,
      }),
  ], []);

  const DataTableTransaction = useMemo(() => {
    if (!withdrawals) return [];

    return withdrawals.map((item) => ({
      txHash: item.txHash || "",
      id: item.id || "",
      email: item.user.email || "",
      amount: item.value || 0,
      status: item.status || '',
      reference: item.reference || '',
      transactionDate: new Date(item.createdAt).toLocaleDateString() || "",
    }));
  }, [withdrawals]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = DataTableTransaction.slice(startIndex, endIndex);
  const totalPages = Math.ceil(DataTableTransaction.length / itemsPerPage);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-5 space-y-4">
        <div className="flex flex-row gap-5 justify-end ps-1.5 my-4">
      <div className="relative sm:block">
        {/* Icon */}
        <Search className="absolute top-5 -translate-y-1/2 start-3 text-black dark:text-white" />
        {/* Input Field */}
        <Input
          type="text"
          id="searchItem"
          name="search"
          placeholder="Search..."
          className="min-h-10 w-56 ps-9 px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white text-black shadow-md"
        />
      </div>
    </div>
      <div>
        <Table
          data={currentItems}
          columns={columns}
        />
      </div>

      {DataTableTransaction.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPages}
          onPageChange={handlePageClick}
          colorScheme="green"
        />
      )}
      {modalOpen && withdraw && (
        <ModalWithdraw onClose={() => setModalOpen(false)} transaction={withdraw} />
      )}
    </div>
  );
};

const TransactionStatusCell = ({ txnId }: { txnId: string }) => {
  const { statusText, error, signal } = usePaymentStatus(txnId);

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-w-[13rem] font-bold text-md capitalize text-center">
      {statusText ? (
        <Badge variant={signal < 0 ? "destructive" : signal === 0 ? "warning" : "success"}>
          {statusText}
        </Badge>
      ) : (
        <div className="text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default function AdminWithdrawPage() {
    return (
      <TransactionProvider>
        <TableAdminWithdraw />
      </TransactionProvider>
    );
  }

