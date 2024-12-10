import { TableUserWithdraw } from "@/components/table/table-user-withdraw";
import { DepositInfo } from "@/components/withdraw/deposit-info";

const WithdrawPage = () => {
  return (
    <>
      <DepositInfo />
      <TableUserWithdraw />
    </>
  );
};

export default WithdrawPage;
