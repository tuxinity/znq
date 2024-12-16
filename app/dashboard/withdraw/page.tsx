import { TableUserWithdraw } from "@/components/table/table-user-withdraw";
import { DepositInfo } from "@/components/withdraw/deposit-info";
import { TransactionProvider } from "@/context/TransactionContext";

const WithdrawPage = () => {
  return (
    <TransactionProvider>
      <DepositInfo />
      <TableUserWithdraw />
    </TransactionProvider>
  );
};

export default WithdrawPage;
