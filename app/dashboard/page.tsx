import BalanceInfo from "@/components/dashboard/balance-info";
import { TableUser } from "@/components/table/table-user";

const DashboardPage = () => {
  return (
    <div>
      <BalanceInfo />
      <TableUser />
    </div>
  );
};

export default DashboardPage;
