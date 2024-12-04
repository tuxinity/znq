import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TopNav } from "@/components/dashboard/topnav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0 border-r p-4 hidden md:block bg-slate-900">
          <DashboardSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
