
'use client';
import { useEffect, useState } from 'react';
export default function Nav(){
  const [role, setRole] = useState<'ADMIN'|'ORGANIZER'|'VIEWER'|'GUEST'>('GUEST');
  useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(j=>setRole(j?.role || 'GUEST')).catch(()=>setRole('GUEST')); }, []);
  return (
    <nav className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <img src={process.env.ORG_LOGO_URL || ''} alt="logo" className="h-8 w-8 rounded hidden sm:block" />
        <div className="font-bold" style={{color:"var(--brand-secondary)"}}>{process.env.ORG_NAME || "MNF Squares"}</div>
        <span className="ml-2 px-2 py-0.5 text-xs rounded-full border brand-badge" style={{borderColor:"var(--brand-secondary)", color:"var(--brand-secondary)"}}>{role}</span>
      </div>
      <div className="flex gap-3 text-sm">
        <a href="/">Home</a>
        <a href="/boards/demo/1">Boards</a>
        {(role==='ADMIN'||role==='ORGANIZER') && <a href="/dashboard">Dashboard</a>}
        {(role==='ADMIN'||role==='ORGANIZER') && <a href="/import">Import</a>}
        {(role==='ADMIN') && <><a href="/admin/users">Users</a><a href="/admin/seed">Seed</a><a href="/admin/setup">Setup</a><a href="/admin/theme">Theme</a></>}
        {(role==='ADMIN') && <a href="/admin/seed">Seed</a>}
        {(role==='ADMIN'||role==='ORGANIZER') && <a href="/live/demo">Live</a>}
        {(role==='GUEST'||role==='VIEWER') ? (<><a href="/login">Login</a><a href="/login/magic">Email Link</a></>) : (<a href="/logout">Logout</a>)}
      </div>
    </nav>
  );
}
