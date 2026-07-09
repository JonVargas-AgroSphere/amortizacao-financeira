import Link from 'next/link';
import artigos from '@/data/artigos.json';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Blog e Dicas Financeiras | Amortização Financeira",
  description: "Aprenda a economizar milhares de reais no seu financiamento imobiliário com nossas dicas de amortização, portabilidade e planejamento financeiro.",
};

export default function ArticlesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <div className="text-center mb-12">
        <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
          Central de Conhecimento
        </h2>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Educação para sua Liberdade Financeira
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
          Artigos técnicos e guias práticos para ajudar você a entender o sistema bancário e economizar milhares de reais no seu financiamento.
        </p>
      </div>

      {/* AdSense Banner Top */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-4xl bg-slate-100 border border-slate-200 rounded-xl h-24 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold shadow-inner">
          <span className="opacity-50">Espaço para Anúncio AdSense (Horizontal - 728x90)</span>
          <span className="text-[10px] text-slate-400/70 mt-1">Anúncios relevantes focados em crédito imobiliário</span>
        </div>
      </div>

      {/* Lista de Artigos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artigos.map((artigo) => (
          <article
            key={artigo.slug}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
          >
            <div className="h-48 overflow-hidden bg-white flex items-center justify-center p-4 border-b border-slate-100">
              <img
                src={`/${artigo.image}`}
                alt={artigo.title}
                className="max-w-full max-h-full object-contain hover:scale-102 transition duration-300"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase self-start">
                {artigo.tag}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 leading-tight">
                {artigo.seo_title.split(' | ')[0]}
              </h3>
              <p className="text-sm text-slate-500 mt-3 line-clamp-4 leading-relaxed">
                {artigo.description}
              </p>
              <Link
                href={`/artigos/${artigo.slug}`}
                className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mt-auto pt-6 group hover:gap-3 transition-all cursor-pointer"
              >
                Ler Artigo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
