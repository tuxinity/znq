import React from "react";
import { useForm } from "react-hook-form";
import { IUserTransaction } from "@/constant/userTransaction";
import { useTransactions } from "@/context/TransactionContext";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, } from "../ui/dialog";

type ModalProps = {
  onClose: () => void;
  transaction: IUserTransaction;
};

export const ModalWithdraw = ({ onClose, transaction }: ModalProps) => {
  const { updateWithdrawal, refetch } = useTransactions();
  const { register, handleSubmit } = useForm<IUserTransaction>({
    defaultValues: {
      id: transaction.id,
      txHash: transaction.txHash,
      status: transaction.status,
      value: transaction.value,
      createdAt: transaction.createdAt
    },
  });

  const onSubmit = async (data: Partial<IUserTransaction>) => {
    try {
      await updateWithdrawal(data.id as string, data.txHash as string);
      await refetch();
      onClose();
    } catch (error) {
      console.error('Update failed', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger asChild>
        <button className="hidden" />
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Transaction
            </DialogTitle>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5 space-y-4">
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Transaction ID
              </label>
              <input
                type="text"
                id="id"
                value={transaction.id}
                className="form-input min-w-full w-56 px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white text-black shadow-md"
              />
            </div>
            <div>
                <label
                    htmlFor="txhash"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Transaction Hash
                </label>
                <input
                    type="text"
                    id="txhash"
                    placeholder="Input TxHash here to update withdraw status"
                    {...register("txHash")}
                    className="form-input min-h-10 min-w-full px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white text-black shadow-md"
                />
                </div>
            <div>
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Amount
              </label>
              <input
                type="number"
                id="value"
                value={transaction.value}
                readOnly
                className="form-input min-h-10 min-w-full px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white text-black shadow-md"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
              <input
                type="text"
                id="status"
                value={transaction.status}
                readOnly
                className="form-input min-h-10 min-w-full px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white text-black shadow-md"
              />
            </div>

            <div>
              <label
                htmlFor="createdAt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Created At
              </label>
              <input
                type="text"
                id="createdAt"
                value={new Date(transaction.createdAt).toLocaleDateString()}
                readOnly
                className="form-input min-w-full px-3 h-8 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded-md outline-none border border-gray-100 dark:border-gray-800 focus:ring-0 bg-white text-black shadow-md"
              />
            </div>

            <div className="flex justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="submit"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Save
              </button>
              <button
                onClick={onClose}
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
