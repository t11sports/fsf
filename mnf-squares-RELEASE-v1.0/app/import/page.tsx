
'use client';
import { useEffect, useState } from 'react';

export default function ImportPage(){
  const [presets, setPresets] = useState<any[]>([]);
  useEffect(()=>{ fetch('/api/import/presets').then(r=>r.json()).then(setPresets).catch(()=>{}); },[]);

  const [role,setRole]=useState(''); useEffect(()=>{ fetch('/api/auth/me').then(r=>r.json()).then(j=>setRole(j?.role||'')); },[]);
  const canImport = role==='ADMIN'||role==='ORGANIZER';
  const [file, setFile] = useState<File|null>(null); const [preview,setPreview]=useState<any>(null); const [mapping,setMapping]=useState<any>({ sales:{ buyerName:'', qty:'' }, buyers:{ phone:'' } });
  async function doPreview(){ if(!file) return; const fd=new FormData(); fd.append('file',file); const r=await fetch('/api/import/preview',{method:'POST',body:fd}); setPreview(await r.json()); }
  async function doCommit(){ if(!preview) return; const r=await fetch('/api/import/commit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ rows:preview.rows, mapping })}); alert(JSON.stringify(await r.json())); }
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Excel Import Wizard</h1><input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} /><div className="space-x-2"><button className="px-3 py-2 bg-black text-white rounded" onClick={doPreview}>Preview</button><button className={`px-3 py-2 rounded text-white ${canImport?'bg-blue-600':'bg-gray-400 cursor-not-allowed'}`} onClick={canImport?doCommit:undefined} disabled={!canImport}>Commit</button></div>{preview&&<div className="text-sm"><p>Headers: {preview.headers.join(', ')}</p><pre className="bg-gray-100 p-2 rounded overflow-auto max-h-72">{JSON.stringify(preview.sample,null,2)}</pre></div>}
  <div className="p-4 border rounded bg-white">
    <label className="text-xs">Preset</label>
    <select className="border p-2 ml-2" onChange={e=>{ const p = presets.find(x=>x.name===e.target.value); if(p){ setMapping(p.mapping); } }}>
      <option>— select preset —</option>
      {presets.map(p=>(<option key={p.name}>{p.name}</option>))}
    </select>
  </div>
</div>); }

