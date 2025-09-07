
'use client';
import { useEffect, useState } from 'react';
export default function Dashboard(){
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ fetch('/api/dashboard/summary').then(r=>r.json()).then(setData); }, []);
  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Organizer Dashboard</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Object.entries(data?.kpis||{}).map(([k,v])=>(<div key={k} className="p-3 border rounded bg-white"><div className="text-xs opacity-70">{k}</div><div className="text-xl font-bold">{typeof v==='number'?v.toFixed? v.toFixed(2):v:v}</div></div>))}</div></div>);
}
