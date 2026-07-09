export const metadata = {
  title: "Política de Privacidade | Amortização Financeira",
  description: "Entenda como coletamos, protegemos e utilizamos suas informações pessoais em nosso portal.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 w-full">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Política de Privacidade</h1>
        <p className="text-xs text-slate-400 mb-8">Última atualização: 8 de junho de 2026</p>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
          <p>
            A sua privacidade é importante para nós. É política do <strong>Amortização Financeira</strong> respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site Amortização Financeira.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">1. Coleta de Informações</h2>
          <p>
            Solicitamos informações pessoais (como nome e WhatsApp) apenas quando realmente precisamos delas para fornecer um serviço de simulação personalizada. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">2. Uso dos Dados</h2>
          <p>
            Os dados coletados no formulário de simulação são utilizados exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Realizar os cálculos de amortização e portabilidade solicitados.</li>
            <li>Permitir que consultores parceiros entrem em contato para oferecer soluções de crédito, caso solicitado pelo usuário.</li>
          </ul>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">3. Retenção de Dados</h2>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemo-los dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">4. Compartilhamento de Dados</h2>
          <p>
            Não compartilhamos informações de identificação pessoal publicamente, exceto com parceiros correspondentes bancários estritamente necessários para a análise de crédito solicitada pelo usuário no formulário de lead.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">5. Google AdSense e Cookies</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>O Google, como fornecedor de terceiros, utiliza cookies para exibir anúncios em nosso site.</li>
            <li>Com o cookie DART, o Google pode exibir anúncios com base nas visitas que o usuário fez a este ou a outros sites na Internet.</li>
            <li>Os usuários podem desativar o cookie DART visitando a Política de Privacidade da rede de conteúdo e dos anúncios do Google.</li>
          </ul>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">6. Compromisso do Usuário</h2>
          <p>
            O usuário se compromete a fazer uso adequado dos conteúdos e da ferramenta oferecida pelo site, não a utilizando para atividades ilícitas ou contrárias à boa fé e à ordem pública.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-8">7. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}
