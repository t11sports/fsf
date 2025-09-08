
const mem = new Map<string,{count:number; resetAt:number}>();
export async function rateLimit({key,max=200,windowSec=60}:{key:string;max?:number;windowSec?:number;}){
  const now = Math.floor(Date.now()/1000); const row=mem.get(key);
  if(!row || row.resetAt<=now){ const resetAt=now+windowSec; mem.set(key,{count:1,resetAt}); return {allowed:true, remaining:max-1, limit:max, reset:resetAt}; }
  if(row.count<max){ row.count+=1; return {allowed:true, remaining:max-row.count, limit:max, reset:row.resetAt}; }
  return {allowed:false, remaining:0, limit:max, reset:row.resetAt};
}
export function applyRateHeaders(res: Response, rl:any){ try{ res.headers.set("X-RateLimit-Limit", String(rl.limit)); res.headers.set("X-RateLimit-Remaining", String(rl.remaining)); res.headers.set("X-RateLimit-Reset", String(rl.reset)); }catch{} return res; }
