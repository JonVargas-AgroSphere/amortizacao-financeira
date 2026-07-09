import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <img 
            src="/logotipo_amortizacao_financeira.png" 
            alt="Logotipo Amortização Financeira" 
            className="h-12 w-auto object-contain rounded-lg bg-white p-1"
          />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">
              Amortização <span className="text-emerald-400">Financeira</span>
            </h1>
            <p className="text-xs text-slate-400">Simulação de Portabilidade e Inteligência de Quitação</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-4 text-xs font-bold">
            <Link href="/" className="hover:text-emerald-400 transition">
              Simulador
            </Link>
            <Link href="/artigos" className="hover:text-emerald-400 transition">
              Artigos
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-2 text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Bancos Conveniados Ativos</span>
          </div>
        </div>
      </div>
    </header>
  );
}
