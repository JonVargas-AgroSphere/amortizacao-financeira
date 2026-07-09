import Link from 'next/link';
import { notFound } from 'next/navigation';
import artigos from '@/data/artigos.json';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const artigo = artigos.find((a) => a.slug === slug);
  
  if (!artigo) {
    return {
      title: "Artigo Não Encontrado | Amortização Financeira",
    };
  }

  return {
    title: artigo.seo_title,
    description: artigo.description,
    alternates: { canonical: `https://www.calculadoramortizacao.com.br/artigos/${slug}` },
    openGraph: {
      title: artigo.seo_title,
      description: artigo.description,
      url: `https://www.calculadoramortizacao.com.br/artigos/${slug}`,
      siteName: "Amortização Financeira",
      locale: "pt_BR",
      type: "article",
      publishedTime: "2026-06-10",
      images: [{ url: `https://www.calculadoramortizacao.com.br/${artigo.image}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: artigo.seo_title,
      description: artigo.description,
      images: [`https://www.calculadoramortizacao.com.br/${artigo.image}`],
    },
  };
}

export async function generateStaticParams() {
  return artigos.map((artigo) => ({
    slug: artigo.slug,
  }));
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const artigo = artigos.find((a) => a.slug === slug);

  if (!artigo) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      {/* Breadcrumbs */}
      <nav className="flex text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 gap-2">
        <Link href="/" className="hover:text-emerald-600 transition">
          Início
        </Link>
        <span>/</span>
        <Link href="/artigos" className="hover:text-emerald-600 transition">
          Artigos
        </Link>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-[200px] sm:max-w-none">
          {artigo.title}
        </span>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Início", item: "https://www.calculadoramortizacao.com.br/" },
                { "@type": "ListItem", position: 2, name: "Artigos", item: "https://www.calculadoramortizacao.com.br/artigos" },
                { "@type": "ListItem", position: 3, name: artigo.title },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: artigo.seo_title.split(" | ")[0],
              description: artigo.description,
              image: `https://www.calculadoramortizacao.com.br/${artigo.image}`,
              datePublished: "2026-06-10",
              dateModified: "2026-06-10",
              author: { "@type": "Organization", name: "Amortização Financeira" },
            },
          ]),
        }}
      />

      <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <header className="mb-8 border-b border-slate-100 pb-8">
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full uppercase">
            {artigo.tag}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-4 leading-tight">
            {artigo.title}
          </h1>
          <div className="flex items-center gap-4 mt-6 text-slate-400 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {artigo.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {artigo.readTime}
            </span>
          </div>
        </header>

        {/* Dynamic HTML Content parsed from the HTML files */}
        <div 
          className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: artigo.content }}
        />

        <footer className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link
            href="/artigos"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Todos os Artigos
          </Link>
          <Link
            href="/"
            className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
          >
            Ir para o Simulador
          </Link>
        </footer>
      </article>
    </div>
  );
}
