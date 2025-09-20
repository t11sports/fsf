// /admin/components/Sidebar.tsx
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-[#152A5D] text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">Next Level Soccer</div>
      <nav className="flex flex-col space-y-3">
        <Link to="/admin" className="hover:underline">Dashboard</Link>
        <Link to="/admin/buyers" className="hover:underline">Buyers</Link>
        <Link to="/admin/players" className="hover:underline">Players</Link>
        <Link to="/admin/games" className="hover:underline">Games</Link>
        <Link to="/admin/sales" className="hover:underline">Sales</Link>
        <Link to="/admin/winners" className="hover:underline">Winners</Link>
        <Link to="/admin/import-export" className="hover:underline">Import/Export</Link>
        <Link to="/admin/auth" className="hover:underline">Auth</Link>
      </nav>
    </div>
  );
};
