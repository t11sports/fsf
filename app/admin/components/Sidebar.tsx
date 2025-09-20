import Link from 'next/link';

const Sidebar = () => (
  <div className="w-64 bg-[#152A5D] text-white flex flex-col p-4">
    <div className="text-2xl font-bold mb-8">Next Level Soccer</div>
    <nav className="flex flex-col space-y-3">
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/buyers">Buyers</Link>
      <Link href="/admin/players">Players</Link>
      <Link href="/admin/games">Games</Link>
      <Link href="/admin/sales">Sales</Link>
      <Link href="/admin/winners">Winners</Link>
      <Link href="/admin/import-export">Import/Export</Link>
      <Link href="/admin/auth">Auth</Link>
    </nav>
  </div>
);

export default Sidebar;
