"use client";

import { useEffect, useState } from "react";
import DashboardSummary from "@/components/admin/DashboardSummary";
import BuyersTable from "@/components/admin/BuyersTable";
import PlayersTable from "@/components/admin/PlayersTable";
import SalesTable from "@/components/admin/SalesTable";
import WinnersTable from "@/components/admin/WinnersTable";
import GamesTable from "@/components/admin/GamesTable";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const secret = prompt("Enter admin password:");
    if (secret === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
    } else {
      alert("Unauthorized");
    }
  }, []);

  if (!auth) return <div>Unauthorized</div>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
      <DashboardSummary />
      <BuyersTable />
      <PlayersTable />
      <SalesTable />
      <WinnersTable />
      <GamesTable />
    </main>
  );
}
