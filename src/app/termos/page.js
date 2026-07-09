export const metadata = {
  title: "Termos de Uso | Amortização Financeira",
  description: "Leia as regras e condições de uso das nossas calculadoras e simuladores imobiliários.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Termos de Uso</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
          <h2 className="text-xl font-bold text-slate-900 mt-8">1. Termos</h2>
          <p>
            Ao acessar o site Amortização Financeira, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">2. Uso de Licença</h2>
          <p>
            É concedida permissão para usar as calculadoras e simuladores do site para uso pessoal e informativo. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modificar ou copiar os materiais para fins comerciais sem autorização;</li>
            <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site.</li>
          </ul>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">3. Isenção de Responsabilidade</h2>
          <p>
            As simulações fornecidas pelo <strong>Amortização Financeira</strong> são baseadas em cálculos matemáticos padrões e não constituem uma garantia de aprovação de crédito ou proposta vinculante por parte de qualquer instituição financeira. Os resultados são estimativas e podem variar conforme as taxas reais de mercado e políticas internas dos bancos.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">4. Limitações</h2>
          <p>
            Em nenhum caso o Amortização Financeira ou seus parceiros serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os simuladores no site.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">5. Precisão dos Materiais</h2>
          <p>
            Os materiais exibidos no site podem incluir erros técnicos, tipográficos ou fotográficos. O Amortização Financeira não garante que qualquer material em seu site seja preciso, completo ou atual, embora busquemos a máxima precisão nos cálculos.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">6. Links</h2>
          <p>
            O Amortização Financeira não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por parte do Amortização Financeira.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">7. Modificações</h2>
          <p>
            O Amortização Financeira pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
          </p>
        </div>
      </div>
    </div>
  );
}
