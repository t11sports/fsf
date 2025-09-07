
'use client';
import { useEffect, useState } from 'react';

export default function ThemeAdmin(){
  const [orgName, setOrgName] = useState('North Lakes Soccer — 2012G');
  const [primary, setPrimary] = useState('#065f46');
  const [secondary, setSecondary] = useState('#16a34a');
  const [logoUrl, setLogoUrl] = useState('/brand/logo.svg');
  const [homeTeam, setHomeTeam] = useState('Home');
  const [awayTeam, setAwayTeam] = useState('Away');
  const [saved, setSaved] = useState<string>('');

  async function save(){
    const r = await fetch('/api/admin/theme/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orgName, primary, secondary, logoUrl, homeTeam, awayTeam }) });
    if(r.ok){ setSaved('Saved!'); setTimeout(()=>setSaved(''), 2000); }
  }
  async function uploadLogo(file: File){
    const fd = new FormData(); fd.append('file', file);
    const r = await fetch('/api/admin/theme/logo', { method:'POST', body: fd });
    const j = await r.json();
    if(r.ok){ setLogoUrl(j.url); setSaved('Logo uploaded'); setTimeout(()=>setSaved(''), 2000); }
  }

  return (<div className="space-y-6 max-w-xl">
    <h1 className="text-2xl font-bold">Admin · Theme</h1>
    <div className="grid gap-3 p-4 border rounded bg-white">
      <div><label className="text-xs">Organization Name</label><input className="border p-2 w-full" value={orgName} onChange={e=>setOrgName(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="text-xs">Primary Color</label><input className="border p-2 w-full" value={primary} onChange={e=>setPrimary(e.target.value)} /></div>
        <div><label className="text-xs">Secondary Color</label><input className="border p-2 w-full" value={secondary} onChange={e=>setSecondary(e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="text-xs">Home Team</label><input className="border p-2 w-full" value={homeTeam} onChange={e=>setHomeTeam(e.target.value)} /></div>
        <div><label className="text-xs">Away Team</label><input className="border p-2 w-full" value={awayTeam} onChange={e=>setAwayTeam(e.target.value)} /></div>
      </div>
      <div><label className="text-xs">Logo URL</label><input className="border p-2 w-full" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} /></div>
      <div><label className="text-xs">Upload Logo</label><input type="file" onChange={e=>e.target.files&&uploadLogo(e.target.files[0])} /></div>
      <button className="px-4 py-2 bg-black text-white rounded" onClick={save}>Save Theme</button>
      {saved && <div className="text-green-700 text-sm">{saved}</div>}
    </div>
    <p className="text-xs opacity-70">Tip: Saved theme writes to <code>/data/theme.json</code>. In serverless environments, write access may not persist.</p>
  </div>);
}
