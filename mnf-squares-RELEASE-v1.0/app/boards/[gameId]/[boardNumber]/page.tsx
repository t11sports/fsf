
'use client';
import useSWR from "swr"; const fetcher=(u:string)=>fetch(u).then(r=>r.json());
export default function BoardPage({ params }:{ params:{gameId:string;boardNumber:string} }){
  const { data } = useSWR(`/api/boards/${params.gameId}/${params.boardNumber}`, fetcher, { refreshInterval: 5000 });
  const digits = data?.digits || { away: [], home: [] }; const squares = data?.squares || {};
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Board {params.boardNumber}</h1><div className="grid grid-cols-11 gap-1"><div></div>{digits.home.map((n:number,i:number)=>(<div key={i} className="p-2 text-center bg-gray-200">{n}</div>))}{digits.away.map((a:number,ri:number)=>(<><div key={`r${ri}`} className="p-2 text-center bg-gray-200">{a}</div>{digits.home.map((_:any,ci:number)=>{ const k=`${a}-${digits.home[ci] ?? ci}`; const v=squares[k]; return <div key={k} className="p-2 text-xs bg-white border min-h-10">{typeof v==='string'?v:(v?.label||v?.buyerId||v?.playerId||'')}</div>; })}</>))}</div></div>);
}
