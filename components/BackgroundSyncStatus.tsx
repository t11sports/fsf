
'use client';
import { useEffect, useState } from 'react';

type QItem = { id?: number; url: string; method: string; retryCount?: number; nextAttempt?: number; body?: any; };

function Toast({ msg }: { msg: string }){
  const [show, setShow] = useState(true);
  useEffect(()=>{ const t=setTimeout(()=>setShow(false), 3500); return ()=>clearTimeout(t); },[]);
  if(!show) return null;
  return <div className="px-3 py-2 bg-black text-white rounded shadow">{msg}</div>;
}

export default function BackgroundSyncStatus(){
  const [count, setCount] = useState<number>(0);
  const [items, setItems] = useState<QItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);

  useEffect(()=>{
    const update = (e?: MessageEvent) => {
      if (e?.data?.type === 'QUEUE_COUNT') setCount(e.data.count);
      if (e?.data?.type === 'QUEUE_SNAPSHOT') setItems(e.data.items || []);
      if (e?.data?.type === 'QUEUED_EVENT') {
        setToasts(t => [...t, e.data.message || 'Action queued offline']);
        setCount(c => c + 1);
      }
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'QUEUE_COUNT_REQUEST' });
        navigator.serviceWorker.controller.postMessage({ type: 'QUEUE_SNAPSHOT_REQUEST' });
      }
    };
    navigator.serviceWorker?.addEventListener('message', update);
    update();
    return () => navigator.serviceWorker?.removeEventListener('message', update);
  }, []);

  async function retryNow(){
    navigator.serviceWorker?.controller?.postMessage({ type: 'FLUSH_QUEUE' });
  }

  if (!('serviceWorker' in navigator)) return null;
  if (count <= 0 && !open) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {/* Toast stack */}
      <div className="flex flex-col gap-2 items-end">{toasts.map((m,i)=>(<Toast key={i} msg={m} />))}</div>

      <div className="bg-white border rounded shadow p-3 text-sm w-80">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Offline actions queued: {count}</div>
          <button onClick={()=>setOpen(!open)} className="text-blue-700 underline">{open?'Hide':'Details'}</button>
        </div>
        <div className="mt-2 flex gap-2">
          <button onClick={retryNow} className="px-3 py-1 rounded bg-blue-600 text-white">Retry now</button>
          <button onClick={()=>{ setToasts([]); }} className="px-3 py-1 rounded border">Clear toasts</button>
        </div>
        {open && (
          <div className="mt-3 max-h-60 overflow-auto divide-y">
            {items.map((it,i)=>(
              <div key={i} className="py-2">
                <div className="font-mono text-xs break-all">{it.method} {it.url}</div>
                <div className="text-xs opacity-70">retry: {it.retryCount||0} · next: {it.nextAttempt? new Date(it.nextAttempt).toLocaleTimeString(): 'now'}</div>
              </div>
            ))}
            {!items.length && <div className="text-xs opacity-60">Empty</div>}
          </div>
        )}
      </div>
    </div>
  );
}
