import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-12 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h4 className="text-white font-extrabold text-xs mb-3 uppercase tracking-wider">
          Aviso Legal e Diretrizes de Portabilidade e Quitação de Dívidas
        </h4>
        <p className="text-[11px] leading-relaxed mb-4 text-justify sm:text-center text-slate-500">
          Esta plataforma é uma ferramenta de simulação matemática desenvolvida para estimar variações de custos com base nas metodologias financeiras comuns aplicadas a contratos imobiliários sob regras vigentes de mercado. O <strong>Resultado de Economia Projetada</strong> e os quadros comparativos gerados por esta calculadora não constituem de forma alguma uma garantia contratual de aprovação de crédito, oferta vinculante de faturamento ou promessa de execução de taxa por qualquer instituição financeira.
        </p>
        <p className="text-[11px] leading-relaxed mb-6 text-justify sm:text-center text-slate-500">
          A aprovação de portabilidade de financiamento está sujeita a vistorias e análises cadastrais individuais conduzidas pelas instituições receptoras da dívida, além de custos cartorários de lavratura de nova escritura imobiliária sob a Lei da Portabilidade (Resolução CMN nº 4.292/2013). Atuamos exclusivamente como um hub digital de originação, conexão e curadoria de dados de intenção para correspondentes bancários credenciados. Não realizamos empréstimos diretos e não transacionamos valores financeiros de nenhuma natureza em nossos servidores.
        </p>
        <div className="border-t border-slate-800 pt-6">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Link href="/privacidade" className="hover:text-emerald-400 transition">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="hover:text-emerald-400 transition">
              Termos de Uso
            </Link>
          </div>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            &copy; 2026 Amortização Financeira. Todos os direitos reservados. Inteligência de Planejamento de Ativos de Massa.
          </p>
        </div>
      </div>
    </footer>
  );
}
