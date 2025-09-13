// app/admin/page.tsx
"use client";

#import Link from "next/link";
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
  
"export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/buyers" className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200">
          Manage Buyers
        </Link>
        <Link href="/admin/players" className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200">
          Manage Players
        </Link>
        <Link href="/admin/sales" className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200">
          Manage Sales
        </Link>
        <Link href="/admin/winners" className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200">
          Manage Winners
        </Link>
        <Link href="/admin/games" className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200">
          Manage Games
        </Link>
        <Link href="/admin/dashboard" className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200">
          View Summary
        </Link>
      </div>
    </div>
  );
}
