'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('lgpd_cookies_aceitos');
    if (!accepted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lgpd_cookies_aceitos', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-slate-300 py-4 px-6 z-50 shadow-2xl transition-transform duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-full hidden md:block">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-4xl text-left">
            Valorizamos sua privacidade. Utilizamos cookies funcionais e de desempenho para melhorar sua experiencia de navegação e gerar cálculos técnicos avançados. Ao prosseguir utilizando nossos simuladores, você declara aceitar o uso de cookies em conformidade com a nossa{' '}
            <Link href="/privacidade" className="text-emerald-400 hover:underline">
              Política de Privacidade
            </Link>{' '}
            de dados sob os preceitos legais da LGPD.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleAccept}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-6 rounded-lg transition cursor-pointer"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
}
