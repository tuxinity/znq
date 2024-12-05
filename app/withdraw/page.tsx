import { TableUserWithdraw } from "@/components/table/table-user-withdraw";
import { DepositInfo } from "@/components/withdraw/deposit-info";

const WithdrawPage = () => {
  return (
    <div>
      <DepositInfo />
      <TableUserWithdraw />
    </div>
  );
};

export default WithdrawPage;
