
'use client';
export default function Setup(){
  return (<div className="space-y-6 max-w-2xl">
    <h1 className="text-2xl font-bold">Admin · Setup Checklist</h1>
    <ol className="list-decimal pl-6 space-y-2">
      <li><b>Configure .env</b> (or .env.production) — set <code>DATABASE_URL</code>, <code>APP_JWT_SECRET</code>, and optionally Stripe/SMTP. See <code>.env.production.sample</code>.</li>
      <li><b>Theme</b>: Drop your logo file to <code>/public/brand/logo.svg</code> (or update <code>ORG_LOGO_URL</code>). Update <code>ORG_PRIMARY</code>/<code>ORG_SECONDARY</code> colors.</li>
      <li><b>Seed schedule</b>: Go to <a className="underline" href="/admin/seed">Admin → Seed</a> and click <i>Seed 2025 MNF Schedule</i>.</li>
      <li><b>Import buyers/sales</b>: Use the <a className="underline" href="/import">Import Wizard</a> to upload your Excel and commit.</li>
      <li><b>Set price</b>: Adjust <code>SQUARE_PRICE_CENTS</code> in env (e.g., 1000 = $10).</li>
      <li><b>Stripe</b>: Set keys and run webhook listener during dev. Test a checkout via the public purchase page.</li>
    </ol>
    <div className="p-4 border rounded bg-white space-y-2">
      <h2 className="font-semibold">Quick Links</h2>
      <div className="flex flex-wrap gap-3 text-sm">
        <a className="underline" href="/admin/seed">Seed</a>
        <a className="underline" href="/import">Import</a>
        <a className="underline" href="/dashboard">Dashboard</a>
        <a className="underline" href="/boards/demo/1">Board demo</a>
        <a className="underline" href="/buy/demo/1">Purchase demo</a>
        <a className="underline" href="/live/demo">Live demo</a>
      </div>
    </div>
    <p className="text-xs opacity-70">Note: Changing env vars requires a server restart. Stripe secrets should not be entered via web UI.</p>
  </div>);
}
