
export default function Offline(){
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">You’re offline</h1>
      <p>This app works offline for most pages. Once you’re back online, features that need the server (like checkout or imports) will resume.</p>
      <ul className="list-disc pl-6 text-sm">
        <li>Boards you've visited will continue to render from cache.</li>
        <li>Dashboard KPIs may be stale until you reconnect.</li>
      </ul>
    </div>
  );
}
