export default function SeedPage(){ async function seedDemo(){ const r=await fetch('/api/admin/seed/demo',{method:'POST'}); if(!r.ok){ alert('Unauthorized or failed'); return; } const j=await r.json(); alert('Seeded demo! Game: '+j.gameId); } return (<div className='space-y-4 max-w-md'><h1 className='text-2xl font-bold'>Admin · Seed Demo</h1><p className='opacity-70 text-sm'>Creates sample players, buyers, sales, a game with two boards, and a couple of winners.</p><button onClick={seedDemo} className='px-4 py-2 bg-black text-white rounded'>Seed demo data</button>
  <div className="p-4 border rounded bg-white space-y-3">
    <h2 className="font-semibold">Seed 2025 Monday Night Football Schedule</h2>
    <p className="text-sm opacity-75">Creates all MNF games for 2025 with <b>two boards per game</b> pre-created.</p>
    <button onClick={seedSchedule2025} className="px-4 py-2 bg-blue-600 text-white rounded">Seed 2025 MNF Schedule</button>
  </div>
</div>); }

async function seedSchedule2025(){
  const r = await fetch('/api/admin/seed/schedule/2025', { method: 'POST' });
  if(!r.ok){ alert('Failed or unauthorized'); return; }
  const j = await r.json();
  alert('Created '+j.created+' MNF games for 2025');
}
