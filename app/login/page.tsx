
'use client';
import { useState } from 'react';
export default function LoginPage(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  async function onSubmit(e:any){ e.preventDefault(); setError(null); const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) }); const j = await res.json(); if(!res.ok){ setError(j?.error || 'Login failed'); return;} window.location.href='/dashboard'; }
  return (<div className="max-w-sm mx-auto mt-16 p-6 border rounded bg-white space-y-4"><h1 className="text-xl font-bold">Organizer Login</h1><form onSubmit={onSubmit} className="space-y-3"><input className="border p-2 rounded w-full" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} /><input className="border p-2 rounded w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><button className="px-4 py-2 bg-black text-white rounded w-full">Sign In</button></form>{error && <div className="text-red-600 text-sm">{error}</div>}<p className="text-xs opacity-70">Default: admin/admin123 · organizer/organizer123</p></div>);
}
