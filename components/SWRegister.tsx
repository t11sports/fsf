
'use client';
import { useEffect } from 'react';
export default function SWRegister(){
  useEffect(()=>{
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Delay a bit to avoid competing with hydration
      const register = () => navigator.serviceWorker.register('/sw.js').catch(()=>{});
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register);
    }
  }, []);
  return null;
}
