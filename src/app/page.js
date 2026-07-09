'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import artigos from '@/data/artigos.json';
import { 
  ArrowLeftRight, 
  Zap, 
  Calculator, 
  HelpCircle, 
  Sparkles, 
  PlusCircle, 
  ChevronDown, 
  Trash2, 
  Plus, 
  LineChart, 
  Send, 
  PartyPopper, 
  X, 
  Loader, 
  TableProperties, 
  PieChart 
} from 'lucide-react';
import {
  Chart,
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar os elementos necessários do Chart.js
Chart.register(
  LineController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Home() {
  const [activeTab, setActiveTab] = useState('portabilidade');

  // ================= TAB 1: PORTABILIDADE STATE =================
  const [saldoDevedor, setSaldoDevedor] = useState(300000);
  const [prazoRestante, setPrazoRestante] = useState(240);
  const [taxaAtual, setTaxaAtual] = useState(10.5);
  const [sistemaAmortizacao, setSistemaAmortizacao] = useState('SAC');
  const [taxaAdm, setTaxaAdm] = useState(25);
  const [seguroMip, setSeguroMip] = useState(80);
  const [taxaNova, setTaxaNova] = useState(8.9);
  
  // Ajustes de Portabilidade
  const [showAjusteForm, setShowAjusteForm] = useState(false);
  const [ajusteNome, setAjusteNome] = useState('');
  const [ajusteTipo, setAjusteTipo] = useState('-');
  const [ajusteValor, setAjusteValor] = useState('');
  const [ajustesList, setAjustesList] = useState([]);

  // Resultados Portabilidade
  const [portEconomiaTotal, setPortEconomiaTotal] = useState(0);
  const [portEconomiaMensalMin, setPortEconomiaMensalMin] = useState(0);
  const [portEconomiaMensalMax, setPortEconomiaMensalMax] = useState(0);
  const [portParcelaAtual, setPortParcelaAtual] = useState(0);
  const [portParcelaNova, setPortParcelaNova] = useState(0);
  const [portEconomiaMensalMedia, setPortEconomiaMensalMedia] = useState(0);
  const [portTotalAjustesCusto, setPortTotalAjustesCusto] = useState(0);

  // ================= TAB 2: DESTRUIDOR STATE =================
  const [destSaldo, setDestSaldo] = useState(300000);
  const [destTaxa, setDestTaxa] = useState(10.5);
  const [destPrazo, setDestPrazo] = useState(240);
  const [destAporte, setDestAporte] = useState(500);
  const [destSistema, setDestSistema] = useState('SAC');

  // Resultados Destruidor
  const [sacTempo, setSacTempo] = useState(0);
  const [sacTotal, setSacTotal] = useState(0);
  const [sacJuros, setSacJuros] = useState(0);
  const [priceTempo, setPriceTempo] = useState(0);
  const [priceTotal, setPriceTotal] = useState(0);
  const [priceJuros, setPriceJuros] = useState(0);
  const [destTempo, setDestTempo] = useState(0);
  const [destTotal, setDestTotal] = useState(0);
  const [destEconomia, setDestEconomia] = useState(0);
  
  // Tabelas
  const [sacTableRows, setSacTableRows] = useState([]);
  const [priceTableRows, setPriceTableRows] = useState([]);
  const [destTableRows, setDestTableRows] = useState([]);
  const [showTableAccordion, setShowTableAccordion] = useState(false);

  // ================= GLOBAL / COMMON STATE =================
  const [showFormula, setShowFormula] = useState(false);
  const [faqOpen, setFaqOpen] = useState({ 1: false, 2: false, 3: false });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // Lead Form
  const [leadNome, setLeadNome] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [leadBanco, setLeadBanco] = useState('');
  const [leadLgpd, setLeadLgpd] = useState(false);

  // Chart References
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartInstance = useRef(null);
  const doughnutChartInstance = useRef(null);

  // Formatar BRL
  const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Alternar FAQ
  const toggleFaq = (id) => {
    setFaqOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Adicionar Ajuste
  const handleAdicionarAjuste = () => {
    const valor = parseFloat(ajusteValor);
    if (ajusteNome.trim() && !isNaN(valor) && valor > 0) {
      setAjustesList((prev) => [...prev, { nome: ajusteNome.trim(), tipo: ajusteTipo, valor }]);
      setAjusteNome('');
      setAjusteValor('');
    }
  };

  // Remover Ajuste
  const handleRemoverAjuste = (index) => {
    setAjustesList((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= CÁLCULOS FINANCEIROS =================

  // Cálculo Portabilidade (Aba 1)
  useEffect(() => {
    if (saldoDevedor <= 0 || prazoRestante <= 0) {
      setPortEconomiaTotal(0);
      setPortEconomiaMensalMin(0);
      setPortEconomiaMensalMax(0);
      setPortParcelaAtual(0);
      setPortParcelaNova(0);
      setPortEconomiaMensalMedia(0);
      setPortTotalAjustesCusto(0);
      return;
    }

    const rAtual = Math.pow(1 + (taxaAtual / 100), 1 / 12) - 1;
    const rNova = Math.pow(1 + (taxaNova / 100), 1 / 12) - 1;

    let totalAjustes = 0;
    ajustesList.forEach((a) => {
      totalAjustes += (a.tipo === '+' ? a.valor : -a.valor);
    });
    setPortTotalAjustesCusto(totalAjustes);

    let parcelaAtualEst = 0;
    let parcelaNovaEst = 0;
    let fluxoTotalAtual = 0;
    let fluxoTotalNovo = 0;

    if (sistemaAmortizacao === "PRICE") {
      const pmtAtual = saldoDevedor * (rAtual * Math.pow(1 + rAtual, prazoRestante)) / (Math.pow(1 + rAtual, prazoRestante) - 1);
      const pmtNovo = saldoDevedor * (rNova * Math.pow(1 + rNova, prazoRestante)) / (Math.pow(1 + rNova, prazoRestante) - 1);
      
      parcelaAtualEst = pmtAtual + taxaAdm + seguroMip;
      parcelaNovaEst = pmtNovo + taxaAdm + seguroMip + totalAjustes;

      fluxoTotalAtual = parcelaAtualEst * prazoRestante;
      fluxoTotalNovo = parcelaNovaEst * prazoRestante;
    } else {
      const amortizacaoFixa = saldoDevedor / prazoRestante;
      let somaAtual = 0;
      let somaNovo = 0;

      parcelaAtualEst = amortizacaoFixa + (saldoDevedor * rAtual) + taxaAdm + seguroMip;
      parcelaNovaEst = amortizacaoFixa + (saldoDevedor * rNova) + taxaAdm + seguroMip + totalAjustes;

      for (let t = 1; t <= prazoRestante; t++) {
        const devedorAtual = saldoDevedor - (amortizacaoFixa * (t - 1));
        somaAtual += amortizacaoFixa + (devedorAtual * rAtual) + taxaAdm + seguroMip;
        somaNovo += amortizacaoFixa + (devedorAtual * rNova) + taxaAdm + seguroMip + totalAjustes;
      }

      fluxoTotalAtual = somaAtual;
      fluxoTotalNovo = somaNovo;
    }

    const economiaTotal = fluxoTotalAtual - fluxoTotalNovo;
    const economiaTotalExibida = Math.max(0, economiaTotal);
    const economiaMensalMedia = (fluxoTotalAtual - fluxoTotalNovo) / prazoRestante;
    const economiaMensalExibida = Math.max(0, economiaMensalMedia);

    setPortEconomiaTotal(economiaTotalExibida);
    setPortEconomiaMensalMin(Math.max(0, economiaMensalExibida * 0.92));
    setPortEconomiaMensalMax(economiaMensalExibida * 1.08);
    setPortParcelaAtual(parcelaAtualEst);
    setPortParcelaNova(parcelaNovaEst);
    setPortEconomiaMensalMedia(economiaMensalExibida);
  }, [saldoDevedor, prazoRestante, taxaAtual, sistemaAmortizacao, taxaAdm, seguroMip, taxaNova, ajustesList]);

  // Cálculo Destruidor (Aba 2)
  useEffect(() => {
    if (destSaldo <= 0 || destPrazo <= 0) return;

    const rMensal = Math.pow(1 + (destTaxa / 100), 1 / 12) - 1;

    // 1. Simular SAC Padrão (Sem Aportes)
    let sacTotalPago = 0;
    let sacTotalJuros = 0;
    let sacSaldo = destSaldo;
    const sacAmortizacaoFixa = destSaldo / destPrazo;
    let sacRows = [];
    let sacSaldosGrafico = [destSaldo];

    for (let t = 1; t <= destPrazo; t++) {
      const juros = sacSaldo * rMensal;
      const parcela = sacAmortizacaoFixa + juros;
      const saldoFinal = Math.max(0, sacSaldo - sacAmortizacaoFixa);
      sacRows.push({ t, sldIni: sacSaldo, pmt: parcela, juros, amort: sacAmortizacaoFixa, sldFim: saldoFinal });
      sacTotalPago += parcela;
      sacTotalJuros += juros;
      sacSaldo = saldoFinal;
      sacSaldosGrafico.push(saldoFinal);
    }

    // 2. Simular Price Padrão (Sem Aportes)
    let priceTotalPago = 0;
    let priceTotalJuros = 0;
    let priceSaldo = destSaldo;
    const pricePmtBase = destSaldo * (rMensal * Math.pow(1 + rMensal, destPrazo)) / (Math.pow(1 + rMensal, destPrazo) - 1);
    let priceRows = [];
    let priceSaldosGrafico = [destSaldo];

    for (let t = 1; t <= destPrazo; t++) {
      const juros = priceSaldo * rMensal;
      const amort = pricePmtBase - juros;
      const saldoFinal = Math.max(0, priceSaldo - amort);
      priceRows.push({ t, sldIni: priceSaldo, pmt: pricePmtBase, juros, amort, sldFim: saldoFinal });
      priceTotalPago += pricePmtBase;
      priceTotalJuros += juros;
      priceSaldo = saldoFinal;
      priceSaldosGrafico.push(saldoFinal);
    }

    // 3. Simular Cenário com Amortizações (Com Aporte Extra)
    let destTotalPago = 0;
    let destTotalJuros = 0;
    let destSaldoAtual = destSaldo;
    let destRows = [];
    let destMesesAteQuitar = 0;
    let destSaldosGrafico = [destSaldo];

    for (let t = 1; t <= destPrazo; t++) {
      if (destSaldoAtual <= 0) break;

      const juros = destSaldoAtual * rMensal;
      let amortizacaoPadrao = 0;
      let pmtPadrao = 0;

      if (destSistema === 'SAC') {
        amortizacaoPadrao = destSaldo / destPrazo;
        pmtPadrao = amortizacaoPadrao + juros;
      } else if (destSistema === 'PRICE') {
        pmtPadrao = pricePmtBase;
        amortizacaoPadrao = pmtPadrao - juros;
      } else { // SAM (Misto)
        const pmtSac = (destSaldo / destPrazo) + juros;
        pmtPadrao = (pmtSac + pricePmtBase) / 2;
        amortizacaoPadrao = pmtPadrao - juros;
      }

      let amortizacaoTotal = amortizacaoPadrao + destAporte;
      let sldFim = destSaldoAtual - amortizacaoTotal;

      if (sldFim < 0) {
        amortizacaoTotal = destSaldoAtual;
        sldFim = 0;
      }

      destRows.push({ t, sldIni: destSaldoAtual, pmt: pmtPadrao, aporte: destAporte, juros, amort: amortizacaoTotal, sldFim });
      destTotalPago += pmtPadrao + (destSaldoAtual >= amortizacaoTotal ? destAporte : (destSaldoAtual - amortizacaoPadrao));
      destTotalJuros += juros;
      destSaldoAtual = sldFim;
      destMesesAteQuitar = t;
      destSaldosGrafico.push(sldFim);
    }

    while (destSaldosGrafico.length < sacSaldosGrafico.length) {
      destSaldosGrafico.push(0);
    }

    // Atualizar os estados
    setSacTempo(destPrazo);
    setSacTotal(sacTotalPago);
    setSacJuros(sacTotalJuros);
    
    setPriceTempo(destPrazo);
    setPriceTotal(priceTotalPago);
    setPriceJuros(priceTotalJuros);

    setDestTempo(destMesesAteQuitar);
    setDestTotal(destTotalPago);

    const baseJurosComp = (destSistema === 'SAC') ? sacTotalJuros : (destSistema === 'PRICE' ? priceTotalJuros : (sacTotalJuros + priceTotalJuros)/2);
    setDestEconomia(Math.max(0, baseJurosComp - destTotalJuros));

    setSacTableRows(sacRows);
    setPriceTableRows(priceRows);
    setDestTableRows(destRows);

    // ================= RENDERIZAR GRÁFICOS (CHART.JS) =================
    if (typeof window !== 'undefined' && lineChartRef.current && doughnutChartRef.current) {
      const labelsGrafico = Array.from({ length: sacSaldosGrafico.length }, (_, i) => i === 0 ? 'Início' : `${i}º Mês`);

      // Destruir gráficos anteriores
      if (lineChartInstance.current) lineChartInstance.current.destroy();
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();

      // Linha
      const ctxLinha = lineChartRef.current.getContext('2d');
      lineChartInstance.current = new Chart(ctxLinha, {
        type: 'line',
        data: {
          labels: labelsGrafico,
          datasets: [
            {
              label: 'SAC Sem Aportes',
              data: sacSaldosGrafico,
              borderColor: '#94a3b8',
              borderWidth: 2,
              fill: false,
              tension: 0.1,
              pointRadius: 0
            },
            {
              label: 'PRICE Sem Aportes',
              data: priceSaldosGrafico,
              borderColor: '#cbd5e1',
              borderWidth: 2,
              fill: false,
              tension: 0.1,
              pointRadius: 0
            },
            {
              label: 'Cenário com Amortizações',
              data: destSaldosGrafico,
              borderColor: '#10b981',
              borderWidth: 3,
              fill: true,
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              tension: 0.1,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { font: { size: 10, family: 'var(--font-sans)' } } }
          },
          scales: {
            x: {
              ticks: { autoSkip: true, maxTicksLimit: 12, font: { size: 9, family: 'var(--font-sans)' } },
              grid: { display: false }
            },
            y: {
              ticks: { font: { size: 9, family: 'var(--font-sans)' } }
            }
          }
        }
      });

      // Rosca
      const ctxRosca = doughnutChartRef.current.getContext('2d');
      doughnutChartInstance.current = new Chart(ctxRosca, {
        type: 'doughnut',
        data: {
          labels: ['Amortização Real', 'Juros Cobrados'],
          datasets: [{
            data: [destSaldo, destTotalJuros],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 10, family: 'var(--font-sans)' } } }
          }
        }
      });
    }
  }, [destSaldo, destTaxa, destPrazo, destAporte, destSistema]);

  // Enviar Lead Form
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    const mensagem = `Olá! Acabei de fazer uma simulação no site *Amortização Financeira* e gostaria de uma análise detalhada:%0A%0A` +
                     `*Nome:* ${leadNome}%0A` +
                     `*WhatsApp:* ${leadWhatsapp}%0A` +
                     `*Banco Atual:* ${leadBanco}%0A` +
                     `*Economia Estimada:* R$ ${activeTab === 'portabilidade' ? BRL.format(portEconomiaTotal) : BRL.format(destEconomia)}%0A` +
                     `*Parcela:* ${activeTab === 'portabilidade' ? BRL.format(portParcelaNova) : BRL.format(destTotal / (destTempo || 1))}%0A%0A` +
                     `Pode me ajudar com o próximo passo?`;

    setTimeout(() => {
      const seuNumero = "5511999999999"; 
      window.open(`https://wa.me/${seuNumero}?text=${mensagem}`, '_blank');
      setSuccessModalOpen(true);
      setIsSubmittingLead(false);
      setLeadNome('');
      setLeadWhatsapp('');
      setLeadBanco('');
      setLeadLgpd(false);
    }, 1000);
  };

  const resultsCard = (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 text-white relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <LineChart className="w-32 h-32" />
      </div>

      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
        {activeTab === 'portabilidade' ? 'Estudo de Economia Estimado' : 'Economia com Amortizações'}
      </h3>
      <p className="text-[11px] text-slate-400 mb-6">
        {activeTab === 'portabilidade' ? 'Auditoria comparativa de portabilidade projetada até a quitação.' : 'Resumo da economia real aproximada gerada pelos aportes.'}
      </p>

      {/* Disclaimer de Segurança */}
      <div className="bg-amber-950/40 border border-amber-900/50 rounded-lg p-3 mb-6">
        <p className="text-[10px] text-amber-200 leading-tight">
          <strong className="font-bold uppercase">Aviso Legal:</strong> Resultados são estimativas baseadas em simulações matemáticas e não constituem garantia de taxa ou aprovação de crédito pelas instituições financeiras.
        </p>
      </div>

      {/* Preço Calculado de Destaque */}
      <div className="mb-2">
        <span className="text-xs text-slate-400 block mb-1">Economia Total Projetada:</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-300">R$</span>
          <span className="text-5xl font-black text-white">
            {activeTab === 'portabilidade' ? BRL.format(portEconomiaTotal) : BRL.format(destEconomia)}
          </span>
        </div>
      </div>

      {/* Faixa de Amortização (Apenas Portabilidade) */}
      {activeTab === 'portabilidade' && (
        <div className="text-[11px] text-slate-400 mb-6 bg-slate-800/60 inline-block px-3 py-1.5 rounded-lg border border-slate-700 w-full">
          <div className="flex justify-between items-center">
            <span>Redução Mensal Estimada:</span>
            <span className="text-emerald-400 font-extrabold">
              R$ {BRL.format(portEconomiaMensalMin)} a R$ {BRL.format(portEconomiaMensalMax)} /mês
            </span>
          </div>
        </div>
      )}

      {/* Detalhamento das Contas */}
      <div className="space-y-3 text-xs font-medium border-t border-slate-800 pt-4">
        {activeTab === 'portabilidade' ? (
          <>
            <div className="flex justify-between text-slate-300">
              <span>Sua Parcela Atual Estimada:</span>
              <span className="text-white font-bold">R$ {BRL.format(portParcelaAtual)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Nova Parcela Proposta:</span>
              <span className="text-emerald-400 font-bold">R$ {BRL.format(portParcelaNova)}</span>
            </div>
            <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-3">
              <span>Economia de Parcela (Média):</span>
              <span className="text-emerald-400 font-bold">R$ {BRL.format(portEconomiaMensalMedia)}/mês</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Custos Extras Inclusos:</span>
              <span className="text-slate-300">R$ {BRL.format(portTotalAjustesCusto)}/mês</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-slate-300">
              <span>Tempo sob Novo Planejamento:</span>
              <span className="text-white font-bold">{destTempo} meses</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Prazo Original Inicial:</span>
              <span className="text-slate-300 font-bold">{destPrazo} meses</span>
            </div>
            <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-3">
              <span>Tempo Economizado na Quitação:</span>
              <span className="text-emerald-400 font-bold">{Math.max(0, destPrazo - destTempo)} meses</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Total Pago com Amortizações:</span>
              <span className="text-slate-300 font-bold">R$ {BRL.format(destTotal)}</span>
            </div>
          </>
        )}
      </div>

      {/* Detalhamento de Fórmulas e Metodologia (Dropdown) */}
      <div className="mt-6 border-t border-slate-800 pt-4">
        <button 
          onClick={() => setShowFormula(!showFormula)} 
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center justify-between w-full transition-colors focus:outline-none cursor-pointer"
        >
          <span className="flex items-center gap-1.5"><Calculator className="w-4 h-4" /> Entenda a matemática do cálculo</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFormula ? 'rotate-180' : ''}`} />
        </button>
        {showFormula && (
          <div className="mt-3 text-[10px] text-slate-400 space-y-2 bg-slate-800/40 p-3 rounded-lg border border-slate-800 leading-relaxed">
            <p><strong>1. Metodologia SAC:</strong> A amortização mensal é fixa ($A = \text{"Saldo Devedor"} / \text{"Prazo"}$). Os juros decrescem proporcionalmente ao saldo devedor mensal amortizado ($J_t = \text{"Saldo Devedor"}_{t-1} \times \text{"Taxa Mensal"}$).</p>
            <p><strong>2. Metodologia Price:</strong> Aplica a fórmula clássica de amortização francesa para parcelas iguais: $P = \text{"Saldo Devedor"} \times \frac{i(1+i)^n}{(1+i)^n - 1}$.</p>
            <p><strong>3. SAM (Misto):</strong> Média aritmética das parcelas calculadas pelo método SAC e Price para o respectivo período.</p>
            <p><strong>4. Cenário Acelerado:</strong> Deduz mensalmente o valor do aporte extraordinário diretamente do Saldo Devedor recalculado, amortizando o prazo remanescente de forma linear.</p>
          </div>
        )}
      </div>
    </div>
  );

  const leadForm = (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-1 shadow-lg transition-all duration-300">
      <div className="bg-white rounded-[22px] p-5 h-full">
        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
          Correspondência Bancária Homologada
        </span>
        <h3 className="text-lg font-extrabold text-slate-900 leading-tight mb-2">Descubra Como Reduzir os Juros do Seu Imóvel</h3>
        <p className="text-xs text-slate-600 mb-4">Conectamos você a parceiros homologados capazes de reduzir suas parcelas e juros imobiliários de forma 100% gratuita.</p>
        
        <form onSubmit={handleLeadSubmit} className="space-y-3">
          <div>
            <input 
              type="text" 
              placeholder="Seu Nome Completo" 
              required 
              value={leadNome}
              onChange={(e) => setLeadNome(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium text-slate-700" 
            />
          </div>
          <div>
            <input 
              type="tel" 
              placeholder="WhatsApp (DDD + Número)" 
              required 
              value={leadWhatsapp}
              onChange={(e) => setLeadWhatsapp(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium text-slate-700" 
            />
          </div>
          <div>
            <select 
              required 
              value={leadBanco}
              onChange={(e) => setLeadBanco(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium text-slate-600"
            >
              <option value="">Qual o seu banco financiador atual?</option>
              <option value="caixa">Caixa Econômica Federal</option>
              <option value="itau">Itaú Unibanco</option>
              <option value="bradesco">Bradesco</option>
              <option value="santander">Santander</option>
              <option value="banco-brasil">Banco do Brasil</option>
              <option value="outros">Outras Instituições</option>
            </select>
          </div>

          {/* Checkbox Termos LGPD */}
          <div className="flex items-start gap-2 pt-1 pb-1">
            <input 
              type="checkbox" 
              id="lead-lgpd" 
              required 
              checked={leadLgpd}
              onChange={(e) => setLeadLgpd(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
            />
            <label htmlFor="lead-lgpd" className="text-[10px] text-slate-500 leading-tight cursor-pointer select-none">
              Autorizo o processamento seguro dos meus dados e declaro aceitar os Termos de Uso e Política de Privacidade da plataforma sob os termos regulamentados da LGPD.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isSubmittingLead}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white font-extrabold py-3 rounded-lg text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 mt-2 shadow-sm cursor-pointer"
          >
            {isSubmittingLead ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-emerald-400" />
                Processando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-emerald-400" />
                Solicitar Análise de Especialista
              </>
            )}
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3">*Seus dados cadastrais e técnicos de simulação estão protegidos sob conformidade com a LGPD e serão compartilhados estritamente com assessores de crédito para fins de análise formal.</p>
      </div>
    </div>
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é melhor na amortização: reduzir prazo ou parcela?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Reduzir o prazo é quase sempre a melhor opção para economizar o máximo de juros possível, pois elimina meses inteiros de incidência de juros sobre o saldo devedor.",
        },
      },
      {
        "@type": "Question",
        name: "Quanto custa fazer a portabilidade de financiamento imobiliário?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O banco pode cobrar taxa de avaliação do imóvel e haverá custos cartorários, mas a economia de juros costuma compensar esses gastos em poucos meses.",
        },
      },
      {
        "@type": "Question",
        name: "Posso usar o FGTS para amortizar o financiamento?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! O FGTS pode ser usado a cada 2 anos para abater o saldo devedor ou as prestações do financiamento imobiliário pelo Sistema Financeiro da Habitação.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* AdSense Top Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 mt-6">
        <div className="w-full bg-slate-100 border border-slate-200 rounded-xl h-[180px] flex flex-col items-center justify-center text-slate-400 text-xs font-semibold shadow-inner">
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-4 h-4 opacity-50" />
            <span>Espaço de Publicidade Regulamentada (Google AdSense - 728x90)</span>
          </div>
          <p className="text-[10px] text-slate-400/70">Anúncios de crédito habitacional autorizados e parceiros de mercado</p>
        </div>
      </div>

      {/* Sistema de Abas Principal */}
      <div className="max-w-7xl mx-auto w-full px-4 mt-6">
        <div className="flex border-b border-slate-200 gap-2">
          <button 
            onClick={() => setActiveTab('portabilidade')} 
            className={`py-3 px-6 font-bold text-sm border-b-2 flex items-center gap-2 transition focus:outline-none cursor-pointer ${
              activeTab === 'portabilidade' 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Simulador de Portabilidade
          </button>
          <button 
            onClick={() => setActiveTab('destruidor')} 
            className={`py-3 px-6 font-bold text-sm border-b-2 flex items-center gap-2 transition focus:outline-none cursor-pointer ${
              activeTab === 'destruidor' 
                ? 'border-emerald-500 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'destruidor' ? 'text-emerald-500' : 'text-slate-400'}`} />
            Planejador de Amortização (Pagar mais rápido)
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
        
        {/* ABA 1: PORTABILIDADE */}
        {activeTab === 'portabilidade' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            {/* Coluna Esquerda: Formulários da Portabilidade (8 colunas) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-800">Dados do Financiamento Atual</h2>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  Insira os dados do seu contrato atual para descobrir como diminuir os juros do seu financiamento imobiliário e avaliar propostas de portabilidade.
                </p>

                {/* Inputs Grupo 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Campo 1: Saldo Devedor */}
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                      Saldo Devedor Atual (R$)
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                      É o valor total restante da sua dívida imobiliária. Essa informação consta no app do seu banco ou na última planilha de evolução.
                      <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">R$</span>
                      <input 
                        type="number" 
                        value={saldoDevedor} 
                        onChange={(e) => setSaldoDevedor(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                      />
                    </div>
                  </div>

                  {/* Campo 2: Prazo Restante */}
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                      Prazo Restante (Meses)
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                      A quantidade de parcelas que ainda faltam ser pagas para concluir o financiamento imobiliário.
                      <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                    </div>
                    <input 
                      type="number" 
                      value={prazoRestante} 
                      onChange={(e) => setPrazoRestante(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                    />
                  </div>
                </div>

                {/* Inputs Grupo 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Campo 3: Taxa de Juros Atual */}
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                      Taxa de Juros Atual (% a.a.)
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                      Custo Efetivo Total (CET) anual cobrado no seu contrato atual. Geralmente varia entre 9% e 12% ao ano.
                      <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.01" 
                        value={taxaAtual} 
                        onChange={(e) => setTaxaAtual(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                      />
                      <span className="absolute right-3 top-2 text-slate-400 text-sm font-semibold">% a.a.</span>
                    </div>
                  </div>

                  {/* Campo 4: Sistema de Amortização */}
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                      Sistema de Amortização
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                      Na SAC, as parcelas são decrescentes. Na Tabela Price, as parcelas mantêm-se constantes do início ao fim se não houver correções adicionais.
                      <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                    </div>
                    <select 
                      value={sistemaAmortizacao} 
                      onChange={(e) => setSistemaAmortizacao(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    >
                      <option value="SAC">SAC (Parcelas Decrescentes)</option>
                      <option value="PRICE">PRICE (Parcelas Fixas)</option>
                    </select>
                  </div>
                </div>

                {/* Taxas e Seguros */}
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3 border-t pt-4 border-slate-100">
                  Taxas e Seguros Mensais Obrigatórios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Campo 5: Taxa Adm Mensal */}
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                      Taxa de Administração (R$/mês)
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                      Tarifa operacional mensal cobrada pela instituição financeira (normalmente entre R$ 20,00 e R$ 30,00).
                      <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">R$</span>
                      <input 
                        type="number" 
                        value={taxaAdm} 
                        onChange={(e) => setTaxaAdm(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                      />
                    </div>
                  </div>

                  {/* Campo 6: Seguro MIP/DFI */}
                  <div className="group relative">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                      Seguro Mensal MIP/DFI (R$)
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                      Seguro imobiliário obrigatório que cobre danos físicos ao imóvel (DFI) e morte/invalidez (MIP).
                      <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">R$</span>
                      <input 
                        type="number" 
                        value={seguroMip} 
                        onChange={(e) => setSeguroMip(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                      />
                    </div>
                  </div>
                </div>

                {/* Nova Taxa Proposta */}
                <div className="bg-emerald-50 border border-emerald-100/80 rounded-xl p-5 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-900">Taxa de Portabilidade Oferecida no Mercado</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group relative">
                      <label className="block text-xs font-bold text-emerald-800 uppercase mb-1 flex items-center gap-1 cursor-help">
                        Nova Taxa Simulada (% a.a.)
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </label>
                      <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                        Nova taxa proposta por um banco concorrente para realizar a portabilidade do seu saldo devedor.
                        <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.01" 
                          value={taxaNova} 
                          onChange={(e) => setTaxaNova(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                        />
                        <span className="absolute right-3 top-2 text-emerald-600 text-sm font-semibold">% a.a.</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end">
                      <span className="text-xs text-emerald-800/80 leading-relaxed">
                        Reduzir a taxa de juros nominal em poucos pontos percentuais pode poupar dezenas de milhares de reais devido ao efeito dos juros compostos ao longo dos anos.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ajustes Personalizados do Usuário */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-bold text-slate-800">Inserir Custos Extras da Portabilidade</h4>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowAjusteForm(!showAjusteForm)} 
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>{showAjusteForm ? 'Ocultar Ajuste' : 'Adicionar Ajuste'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showAjusteForm ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Form para Novo Ajuste */}
                  {showAjusteForm && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 transition-all">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome do Item / Tarifa</label>
                          <input 
                            type="text" 
                            placeholder="Ex: Novo Seguro Adicional" 
                            value={ajusteNome}
                            onChange={(e) => setAjusteNome(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700" 
                          />
                        </div>
                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Impacto</label>
                          <select 
                            value={ajusteTipo} 
                            onChange={(e) => setAjusteTipo(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-slate-700"
                          >
                            <option value="-">Desconta (-)</option>
                            <option value="+">Acrescenta (+)</option>
                          </select>
                        </div>
                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Valor Mensal</label>
                          <input 
                            type="number" 
                            placeholder="R$ 0,00" 
                            value={ajusteValor}
                            onChange={(e) => setAjusteValor(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700" 
                          />
                        </div>
                        <div className="flex items-end">
                          <button 
                            type="button" 
                            onClick={handleAdicionarAjuste}
                            className="bg-slate-800 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 text-xs font-bold transition h-fit cursor-pointer"
                          >
                            Aplicar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Ajustes Cadastrados */}
                  <div className="space-y-2">
                    {ajustesList.map((a, index) => (
                      <div key={index} className="flex justify-between items-center text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm">
                        <span className="font-medium truncate flex-1 pr-2">{a.nome}</span>
                        <span className={`font-bold mr-3 whitespace-nowrap ${a.tipo === '+' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {a.tipo} R$ {BRL.format(a.valor)}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoverAjuste(index)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer" 
                          title="Remover este item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AdSense Middle Box */}
              <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl h-[180px] flex flex-col items-center justify-center text-slate-400 text-xs font-semibold shadow-inner">
                <div className="flex items-center gap-2 mb-1">
                  <LineChart className="w-4 h-4 opacity-50" />
                  <span>Espaço de Publicidade (Google AdSense - Artigo In-Feed)</span>
                </div>
                <p className="text-[10px] text-slate-400/70">Anúncios relevantes focados em crédito e mercado imobiliário</p>
              </div>

              {/* FAQ */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Dúvidas Frequentes</h3>
                  <h2 class="text-lg font-bold text-slate-800">Tudo sobre Amortização</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* FAQ Item 1 */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(1)} 
                      className="w-full px-5 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition font-bold text-slate-700 text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>O que é melhor: prazo ou parcela?</span>
                      <Plus className={`w-4 h-4 text-emerald-600 transition-transform ${faqOpen[1] ? 'rotate-45' : ''}`} />
                    </button>
                    {faqOpen[1] && (
                      <div className="p-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                        Reduzir o <strong>prazo</strong> é quase sempre a melhor opção para economizar o máximo de juros possível.
                      </div>
                    )}
                  </div>

                  {/* FAQ Item 2 */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(2)} 
                      className="w-full px-5 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition font-bold text-slate-700 text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>Custo para portabilidade?</span>
                      <Plus className={`w-4 h-4 text-emerald-600 transition-transform ${faqOpen[2] ? 'rotate-45' : ''}`} />
                    </button>
                    {faqOpen[2] && (
                      <div className="p-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                        O banco pode cobrar taxa de avaliação e haverá custos cartorários, mas a economia de juros costuma compensar.
                      </div>
                    )}
                  </div>

                  {/* FAQ Item 3 */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(3)} 
                      className="w-full px-5 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition font-bold text-slate-700 text-sm text-left focus:outline-none cursor-pointer"
                    >
                      <span>Usar FGTS para amortizar?</span>
                      <Plus className={`w-4 h-4 text-emerald-600 transition-transform ${faqOpen[3] ? 'rotate-45' : ''}`} />
                    </button>
                    {faqOpen[3] && (
                      <div className="p-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100">
                        Sim! O FGTS pode ser usado a cada 2 anos para abater o saldo devedor ou as prestações.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita Estática da Portabilidade (4 colunas) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {resultsCard}
              {leadForm}
            </div>
          </div>
        )}

        {/* ABA 2: DESTRUIDOR DE DÍVIDA */}
        {activeTab === 'destruidor' && (
          <div className="flex flex-col gap-8 w-full animate-fadeIn">
            {/* Card de Entrada de Dados e Tabelas */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6">
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="text-emerald-500 w-6 h-6" />
                  Como Pagar Financiamento Mais Rápido
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Descubra como amortizar financiamento para quitar juros imobiliários mais cedo por meio de aportes estratégicos adicionais.
                </p>
              </div>

              {/* Seção de Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2 border-t border-slate-100 pt-4">
                {/* Campo 1: Saldo Devedor */}
                <div className="group relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                    Saldo Devedor Inicial (R$)
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                    O montante total que você deve ao banco hoje. Utilizado como base de partida para todas as tabelas comparativas.
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">R$</span>
                    <input 
                      type="number" 
                      value={destSaldo} 
                      onChange={(e) => setDestSaldo(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                    />
                  </div>
                </div>

                {/* Campo 2: Taxa de Juros Anual */}
                <div className="group relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                    Taxa de Juros Anual (%)
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                    Taxa de juros anual nominal contratada (CET) do seu financiamento.
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01" 
                      value={destTaxa} 
                      onChange={(e) => setDestTaxa(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                    />
                    <span className="absolute right-3 top-2 text-slate-400 text-sm font-semibold">% a.a.</span>
                  </div>
                </div>

                {/* Campo 3: Prazo Contratual */}
                <div className="group relative">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                    Prazo do Financiamento (Meses)
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                    Prazo contratual restante em meses para as simulações base de SAC e Price.
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                  </div>
                  <input 
                    type="number" 
                    value={destPrazo} 
                    onChange={(e) => setDestPrazo(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                  />
                </div>

                {/* Campo 4: Aporte Extra Mensal */}
                <div className="group relative">
                  <label className="block text-xs font-bold text-emerald-700 uppercase mb-1 flex items-center gap-1 cursor-help">
                    Aporte Mensal Adicional (R$)
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </label>
                  <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                    O valor extra que você planeja pagar mensalmente além da parcela padrão para abater diretamente do saldo devedor principal.
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-emerald-600 font-bold text-sm">R$</span>
                    <input 
                      type="number" 
                      value={destAporte} 
                      onChange={(e) => setDestAporte(parseFloat(e.target.value) || 0)}
                      className="w-full bg-emerald-50 border border-emerald-300 rounded-lg pl-10 pr-3 py-2 text-sm font-semibold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" 
                    />
                  </div>
                </div>

                {/* Campo 5: Método de Amortização */}
                <div className="group relative md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1 flex items-center gap-1 cursor-help">
                    Sistema de Amortização Base do Cenário de Amortizações
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </label>
                  <div className="tooltip-box pointer-events-none absolute bottom-full left-0 mb-2 w-72 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-30 leading-relaxed">
                    Escolha qual método será usado no Cenário com Amortizações para calcular a parcela regular antes de injetar os aportes adicionais.
                    <div className="absolute w-2.5 h-2.5 bg-slate-800 transform rotate-45 -bottom-1 left-4"></div>
                  </div>
                  <select 
                    value={destSistema} 
                    onChange={(e) => setDestSistema(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  >
                    <option value="SAC">SAC (Amortização Constante + Aporte Extra)</option>
                    <option value="PRICE">PRICE (Tabela Price + Aporte Extra)</option>
                    <option value="SAM">SAM Misto (Média de Amortização + Aporte Extra)</option>
                  </select>
                </div>
              </div>

              {/* Resumo e Gráfico Rosca */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t pt-6 border-slate-100 items-stretch">
                {/* Cards */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 shadow-sm">
                    <h4 className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                      Cenário com Amortizações (Com Aporte)
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-700">
                      <div className="flex flex-col p-2 bg-white/60 rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Tempo Total</span>
                        <span className="font-bold text-emerald-950 text-xs mt-0.5">{destTempo} meses</span>
                      </div>
                      <div className="flex flex-col p-2 bg-white/60 rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Total a Pagar</span>
                        <span className="font-bold text-emerald-950 text-xs mt-0.5">R$ {BRL.format(destTotal)}</span>
                      </div>
                      <div className="flex flex-col p-2 bg-emerald-100/50 rounded-lg">
                        <span className="text-emerald-800 text-[9px] uppercase font-bold">Economia</span>
                        <span className="font-black text-emerald-600 text-xs mt-0.5">R$ {BRL.format(destEconomia)}</span>
                      </div>
                    </div>
                  </div>

                  {/* SAC */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5 text-slate-400" />
                      SAC Padrão (Sem Aporte)
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
                      <div className="flex flex-col p-2 bg-white rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Tempo Total</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5">{sacTempo} meses</span>
                      </div>
                      <div className="flex flex-col p-2 bg-white rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Total a Pagar</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5">R$ {BRL.format(sacTotal)}</span>
                      </div>
                      <div className="flex flex-col p-2 bg-white rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Total Juros</span>
                        <span className="font-semibold text-red-500 text-xs mt-0.5">R$ {BRL.format(sacJuros)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-sm">
                    <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5 text-slate-400" />
                      PRICE Padrão (Sem Aporte)
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
                      <div className="flex flex-col p-2 bg-white rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Tempo Total</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5">{priceTempo} meses</span>
                      </div>
                      <div className="flex flex-col p-2 bg-white rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Total a Pagar</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5">R$ {BRL.format(priceTotal)}</span>
                      </div>
                      <div className="flex flex-col p-2 bg-white rounded-lg">
                        <span className="text-slate-400 text-[9px] uppercase font-semibold">Total Juros</span>
                        <span className="font-semibold text-red-500 text-xs mt-0.5">R$ {BRL.format(priceJuros)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rosca Chart */}
                <div className="lg:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-1.5 justify-center">
                      <PieChart className="w-4 h-4 text-emerald-500" />
                      Composição da Dívida (Cenário Amortizado)
                    </h4>
                    <div className="relative w-full h-48 flex justify-center items-center">
                      <canvas ref={doughnutChartRef}></canvas>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center leading-tight mt-3">Os juros diminuem agressivamente à medida que aportes extraordinários são consolidados na planilha.</p>
                </div>

                {/* AdSense lateral */}
                <div className="lg:col-span-3 flex">
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs font-semibold shadow-inner p-4 text-center min-h-[180px]">
                    <div className="flex items-center gap-2 mb-1 justify-center">
                      <LineChart className="w-4 h-4 opacity-50" />
                      <span>Espaço de Publicidade (AdSense - 300x250)</span>
                    </div>
                    <p className="text-[10px] text-slate-400/70">Anúncios relevantes sobre crédito habitacional e quitação</p>
                  </div>
                </div>
              </div>

              {/* Linha Chart */}
              <div className="grid grid-cols-1 gap-6 border-t pt-6 border-slate-100">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner">
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <LineChart className="w-4 h-4 text-emerald-500" />
                    Curva de Quitação do Saldo Devedor ao Longo do Tempo
                  </h4>
                  <div className="relative w-full h-72 md:h-80">
                    <canvas ref={lineChartRef}></canvas>
                  </div>
                </div>
              </div>

              {/* Tabelas de amortização */}
              <div className="border-t border-slate-100 pt-6">
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button 
                    type="button" 
                    onClick={() => setShowTableAccordion(!showTableAccordion)} 
                    className="w-full px-5 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition font-bold text-slate-700 text-sm focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <TableProperties className="w-4.5 h-4.5 text-emerald-600" />
                      Ver Detalhamento de Amortização Mês a Mês (Tabelas Comparativas)
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showTableAccordion ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showTableAccordion && (
                    <div className="p-5 border-t border-slate-200">
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        
                        {/* SAC Padrão */}
                        <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-slate-800 text-white text-xs font-bold px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                            <span>Tabela 1: SAC Padrão</span>
                            <span className="text-[10px] text-slate-400 font-normal bg-slate-900/40 px-2 py-0.5 rounded">Sem Aporte</span>
                          </div>
                          <div className="overflow-x-auto max-h-96 no-scrollbar">
                            <table className="w-full text-left border-collapse text-xs min-w-[300px]">
                              <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
                                <tr>
                                  <th className="p-3 border-b border-slate-200">Mês</th>
                                  <th className="p-3 border-b border-slate-200">Sld. Inicial</th>
                                  <th className="p-3 border-b border-slate-200">Parcela / Detalhe</th>
                                  <th className="p-3 border-b border-slate-200">Sld. Final</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {sacTableRows.map((row) => (
                                  <tr key={row.t} className="hover:bg-slate-50 transition border-b border-slate-100">
                                    <td className="p-3 font-bold text-slate-500">{row.t}º</td>
                                    <td className="p-3 text-slate-600">R$ {BRL.format(row.sldIni)}</td>
                                    <td className="p-3 text-slate-800 font-medium">
                                      <div>R$ {BRL.format(row.pmt)}</div>
                                      <div className="text-[9px] text-slate-400">Juros: R$ {BRL.format(row.juros)} | Amort: R$ {BRL.format(row.amort)}</div>
                                    </td>
                                    <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">R$ {BRL.format(row.sldFim)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Price Padrão */}
                        <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="bg-slate-800 text-white text-xs font-bold px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                            <span>Tabela 2: PRICE Padrão</span>
                            <span className="text-[10px] text-slate-400 font-normal bg-slate-900/40 px-2 py-0.5 rounded">Sem Aporte</span>
                          </div>
                          <div className="overflow-x-auto max-h-96 no-scrollbar">
                            <table className="w-full text-left border-collapse text-xs min-w-[300px]">
                              <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10 shadow-sm">
                                <tr>
                                  <th className="p-3 border-b border-slate-200">Mês</th>
                                  <th className="p-3 border-b border-slate-200">Sld. Inicial</th>
                                  <th className="p-3 border-b border-slate-200">Parcela / Detalhe</th>
                                  <th className="p-3 border-b border-slate-200">Sld. Final</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {priceTableRows.map((row) => (
                                  <tr key={row.t} className="hover:bg-slate-50 transition border-b border-slate-100">
                                    <td className="p-3 font-bold text-slate-500">{row.t}º</td>
                                    <td className="p-3 text-slate-600">R$ {BRL.format(row.sldIni)}</td>
                                    <td className="p-3 text-slate-800 font-medium">
                                      <div>R$ {BRL.format(row.pmt)}</div>
                                      <div className="text-[9px] text-slate-400">Juros: R$ {BRL.format(row.juros)} | Amort: R$ {BRL.format(row.amort)}</div>
                                    </td>
                                    <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">R$ {BRL.format(row.sldFim)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Cenário Amortizações */}
                        <div className="flex flex-col bg-white border border-emerald-200 rounded-xl overflow-hidden shadow-md">
                          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-4 py-3 border-b border-emerald-700 flex justify-between items-center">
                            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-emerald-300" /> Tabela 3: Cenário com Amortizações</span>
                            <span className="text-[10px] text-emerald-100 font-semibold bg-emerald-700/40 px-2 py-0.5 rounded">Com Aporte</span>
                          </div>
                          <div className="overflow-x-auto max-h-96 no-scrollbar">
                            <table className="w-full text-left border-collapse text-xs min-w-[320px]">
                              <thead className="bg-emerald-50/50 text-slate-700 sticky top-0 z-10 shadow-sm">
                                <tr>
                                  <th className="p-3 border-b border-slate-200">Mês</th>
                                  <th className="p-3 border-b border-slate-200">Sld. Inicial</th>
                                  <th className="p-3 border-b border-slate-200">Pgt. + Aporte</th>
                                  <th className="p-3 border-b border-slate-200 font-bold text-emerald-900">Sld. Final</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {destTableRows.map((row) => (
                                  <tr key={row.t} className="hover:bg-emerald-50/20 transition border-b border-slate-100">
                                    <td className="p-3 font-bold text-slate-500">{row.t}º</td>
                                    <td className="p-3 text-slate-600">R$ {BRL.format(row.sldIni)}</td>
                                    <td className="p-3 text-slate-800 font-medium">
                                      <div className="font-bold">R$ {BRL.format(row.pmt + row.aporte)}</div>
                                      <div className="text-[9px] text-emerald-600">Aporte: R$ {BRL.format(row.aporte)} | Juros: R$ {BRL.format(row.juros)}</div>
                                    </td>
                                    <td className="p-3 font-bold text-emerald-900 bg-emerald-50/40">R$ {BRL.format(row.sldFim)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resultado e Leads do Destruidor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {resultsCard}
              {leadForm}
            </div>
          </div>
        )}

        {/* SEÇÃO DE CONTEÚDO SEO - LISTA VERTICAL DE ARTIGOS */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="mb-4 px-2">
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Inteligência Financeira</h3>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Guia de Planejamento de Ativos</h2>
              <p className="text-sm text-slate-500 mt-2 text-balance">Explore nossos manuais técnicos e estratégias definitivas para reduzir juros e quitar seu imóvel antes do prazo.</p>
            </div>

            {artigos.map((artigo, idx) => (
              <Link
                key={artigo.slug}
                href={`/artigos/${artigo.slug}`}
                className="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all group min-h-[160px] cursor-pointer"
              >
                <div className="sm:w-[30%] bg-slate-50 border-r border-slate-100 flex items-center justify-center p-4">
                  <img 
                    src={`/${artigo.image}`} 
                    alt={artigo.title} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="sm:w-[70%] p-6 flex flex-col justify-center min-w-0">
                  <span className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase self-start mb-2 tracking-widest ${
                    artigo.tag.toLowerCase().includes('manual') 
                      ? 'bg-blue-100 text-blue-900' 
                      : artigo.tag.toLowerCase().includes('alerta') 
                      ? 'bg-red-100 text-red-900' 
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {artigo.tag}
                  </span>
                  <h4 className="text-lg lg:text-xl font-black text-slate-900 leading-tight mb-2 uppercase">
                    {artigo.title.split(':')[0]}
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {artigo.description}
                  </p>
                  <span className="text-xs font-black text-emerald-600 mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Acessar Guia Completo <ArrowLeftRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* AdSense Lateral */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="sticky top-8 w-full bg-slate-100 border border-slate-200 rounded-3xl h-full min-h-[800px] lg:min-h-[1200px] flex flex-col items-center justify-center text-slate-400 text-xs font-semibold shadow-inner p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <LineChart className="w-8 h-8 opacity-30" />
                <span className="uppercase tracking-widest">Publicidade Premium</span>
                <p className="text-[10px] text-slate-400/70">Anúncios baseados em seu perfil de crédito imobiliário</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {successModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border border-emerald-500/20 relative">
            <button 
              onClick={() => setSuccessModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <PartyPopper className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Simulação Processada!</h3>
            <p className="text-xs text-slate-600 mb-6">
              Nossa assessoria homologada de correspondentes foi acionada. Eles analisarão o cenário que você calculou e entrarão em contato via WhatsApp de forma 100% gratuita.
            </p>
            <button 
              onClick={() => setSuccessModalOpen(false)} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm tracking-wider uppercase transition cursor-pointer"
            >
              Voltar ao Painel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
