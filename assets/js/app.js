lucide.createIcons();

function parseBRL(valor) {
    if (typeof valor !== 'string') valor = String(valor);
    return parseFloat(valor.replace(',', '.')) || 0;
}

function capPrazo(prazo) {
    return Math.min(Math.max(1, Math.floor(prazo)), 600);
}

const inputSaldoDevedor = document.getElementById('input-saldo-devedor');
const inputPrazoRestante = document.getElementById('input-prazo-restante');
const inputTaxaAtual = document.getElementById('input-taxa-atual');
const selectAmortizacao = document.getElementById('select-amortizacao');
const inputTaxaAdm = document.getElementById('input-taxa-adm');
const inputSeguroMip = document.getElementById('input-seguro-mip');
const inputTaxaNova = document.getElementById('input-taxa-nova');

const destSaldo = document.getElementById('dest-saldo');
const destTaxa = document.getElementById('dest-taxa');
const destPrazo = document.getElementById('dest-prazo');
const destAporte = document.getElementById('dest-aporte');
const destSistema = document.getElementById('dest-sistema');

const formAjusteContainer = document.getElementById('form-ajuste-container');
const btnAjusteTexto = document.getElementById('btn-ajuste-texto');
const ajusteChevron = document.getElementById('ajuste-chevron');
const listaAjustes = document.getElementById('lista-ajustes');

const resEconomiaTotal = document.getElementById('res-economia-total');
const resEconomiaMensalFaixa = document.getElementById('res-economia-mensal-faixa');
const resParcelaAtual = document.getElementById('res-parcela-atual');
const resParcelaNova = document.getElementById('res-parcela-nova');
const resEconomiaMensal = document.getElementById('res-economia-mensal');
const resCustosExtras = document.getElementById('res-custos-extras');

const cardSacTempo = document.getElementById('card-sac-tempo');
const cardSacTotal = document.getElementById('card-sac-total');
const cardSacJuros = document.getElementById('card-sac-juros');
const cardPriceTempo = document.getElementById('card-price-tempo');
const cardPriceTotal = document.getElementById('card-price-total');
const cardPriceJuros = document.getElementById('card-price-juros');
const cardDestTempo = document.getElementById('card-dest-tempo');
const cardDestTotal = document.getElementById('card-dest-total');
const cardDestEconomia = document.getElementById('card-dest-economia');
const sacTableBody = document.getElementById('sac-table-body');
const priceTableBody = document.getElementById('price-table-body');
const destTableBody = document.getElementById('dest-table-body');

let devedorAjustes = [];
let activeTab = 'portabilidade';
let lineChartInstance = null;
let pieChartInstance = null;

function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    const btnPort = document.getElementById('btn-tab-portabilidade');
    const btnDest = document.getElementById('btn-tab-destruidor');

    const resultsCard = document.getElementById('results-card');
    const leadFormContainer = document.getElementById('lead-form-container');
    const adSidebar = document.getElementById('ad-sidebar');

    if (tabId === 'portabilidade') {
        btnPort.className = "py-3 px-6 font-bold text-sm border-b-2 border-emerald-500 text-emerald-600 flex items-center gap-2 transition focus:outline-none";
        btnDest.className = "py-3 px-6 font-bold text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-2 transition focus:outline-none";

        const sidebar = document.getElementById('sidebar-container');
        if (sidebar && resultsCard && leadFormContainer && adSidebar) {
            adSidebar.classList.remove('hidden');
            sidebar.appendChild(resultsCard);
            sidebar.appendChild(leadFormContainer);
            sidebar.appendChild(adSidebar);
        }
    } else {
        btnPort.className = "py-3 px-6 font-bold text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-2 transition focus:outline-none";
        btnDest.className = "py-3 px-6 font-bold text-sm border-b-2 border-emerald-500 text-emerald-600 flex items-center gap-2 transition focus:outline-none";

        const bottom = document.getElementById('bottom-container');
        if (bottom && resultsCard && leadFormContainer && adSidebar) {
            adSidebar.classList.add('hidden');
            bottom.appendChild(resultsCard);
            bottom.appendChild(leadFormContainer);
        }
    }
    calcularPortabilidade();
    calcularDestruidor();
}

function toggleFormAjuste() {
    if (formAjusteContainer.classList.contains('hidden')) {
        formAjusteContainer.classList.remove('hidden');
        btnAjusteTexto.textContent = "Ocultar Ajuste";
        ajusteChevron.classList.add('rotate-180');
    } else {
        formAjusteContainer.classList.add('hidden');
        btnAjusteTexto.textContent = "Adicionar Ajuste";
        ajusteChevron.classList.remove('rotate-180');
    }
}

function toggleTablesAccordion() {
    const content = document.getElementById('tables-accordion-content');
    const chevron = document.getElementById('tables-accordion-chevron');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

function adicionarAjuste() {
    const nomeInput = document.getElementById('ajuste-nome');
    const valorInput = document.getElementById('ajuste-valor');
    const tipo = document.getElementById('ajuste-tipo').value;

    const nome = nomeInput.value.trim();
    const valor = parseFloat(valorInput.value);

    if (nome && !isNaN(valor) && valor > 0) {
        devedorAjustes.push({ nome, tipo, valor });
        nomeInput.value = '';
        valorInput.value = '';
        renderAjustes();
    }
}

function removerAjuste(index) {
    devedorAjustes.splice(index, 1);
    renderAjustes();
}

function renderAjustes() {
    listaAjustes.innerHTML = '';

    devedorAjustes.forEach((a, index) => {
        const div = document.createElement('div');
        div.className = "flex justify-between items-center text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-600 shadow-sm";
        const colorClass = a.tipo === '+' ? 'text-red-500' : 'text-emerald-500';

        div.innerHTML = `
            <span class="font-medium truncate flex-1 pr-2">${a.nome}</span>
            <span class="font-bold ${colorClass} mr-3 whitespace-nowrap">${a.tipo} R$ ${a.valor.toFixed(2).replace('.', ',')}</span>
            <button type="button" onclick="removerAjuste(${index})" class="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remover este item">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        listaAjustes.appendChild(div);
    });
    lucide.createIcons();
    calcularPortabilidade();
}

function toggleFormula() {
    const content = document.getElementById('formula-content');
    const chevron = document.getElementById('formula-chevron');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

function calcularPortabilidade() {
    const saldoDevedor = Math.max(0, parseBRL(inputSaldoDevedor.value));
    const prazo = capPrazo(parseInt(inputPrazoRestante.value) || 0);
    const taxaAtualAnual = Math.max(0, parseBRL(inputTaxaAtual.value));
    const taxaNovaAnual = Math.max(0, parseBRL(inputTaxaNova.value));
    const sistema = selectAmortizacao.value;
    const taxaAdm = Math.max(0, parseBRL(inputTaxaAdm.value));
    const seguroMip = Math.max(0, parseBRL(inputSeguroMip.value));

    if (saldoDevedor <= 0 || prazo <= 0) {
        resEconomiaTotal.textContent = "0,00";
        resEconomiaMensalFaixa.textContent = "R$ 0,00 a R$ 0,00 /mês";
        resParcelaAtual.textContent = "R$ 0,00";
        resParcelaNova.textContent = "R$ 0,00";
        resEconomiaMensal.textContent = "R$ 0,00/mês";
        resCustosExtras.textContent = "R$ 0,00/mês";
        return;
    }

    const tipoTaxa = document.querySelector('input[name="tipo-taxa-port"]:checked')?.value || 'nominal';
    const rAtual = tipoTaxa === 'nominal' ? (taxaAtualAnual / 100) / 12 : Math.pow(1 + (taxaAtualAnual / 100), 1 / 12) - 1;
    const rNova = tipoTaxa === 'nominal' ? (taxaNovaAnual / 100) / 12 : Math.pow(1 + (taxaNovaAnual / 100), 1 / 12) - 1;

    let totalAjustesCusto = 0;
    devedorAjustes.forEach(a => {
        totalAjustesCusto += (a.tipo === '+' ? a.valor : -a.valor);
    });

    let parcelaAtualEst = 0;
    let parcelaNovaEst = 0;
    let fluxoTotalAtual = 0;
    let fluxoTotalNovo = 0;

    if (sistema === "PRICE") {
        const pmtAtual = rAtual <= 0 ? saldoDevedor / prazo : saldoDevedor * (rAtual * Math.pow(1 + rAtual, prazo)) / (Math.pow(1 + rAtual, prazo) - 1);
        const pmtNovo = rNova <= 0 ? saldoDevedor / prazo : saldoDevedor * (rNova * Math.pow(1 + rNova, prazo)) / (Math.pow(1 + rNova, prazo) - 1);

        parcelaAtualEst = pmtAtual + taxaAdm + seguroMip;
        parcelaNovaEst = pmtNovo + taxaAdm + seguroMip + totalAjustesCusto;

        fluxoTotalAtual = parcelaAtualEst * prazo;
        fluxoTotalNovo = parcelaNovaEst * prazo;
    } else {
        const amortizacaoFixa = saldoDevedor / prazo;
        let somaAtual = 0;
        let somaNovo = 0;

        parcelaAtualEst = amortizacaoFixa + (saldoDevedor * rAtual) + taxaAdm + seguroMip;
        parcelaNovaEst = amortizacaoFixa + (saldoDevedor * rNova) + taxaAdm + seguroMip + totalAjustesCusto;

        for (let t = 1; t <= prazo; t++) {
            const devedorAtual = saldoDevedor - (amortizacaoFixa * (t - 1));
            somaAtual += amortizacaoFixa + (devedorAtual * rAtual) + taxaAdm + seguroMip;
            somaNovo += amortizacaoFixa + (devedorAtual * rNova) + taxaAdm + seguroMip + totalAjustesCusto;
        }

        fluxoTotalAtual = somaAtual;
        fluxoTotalNovo = somaNovo;
    }

    let economiaTotal = fluxoTotalAtual - fluxoTotalNovo;
    let economiaTotalExibida = Math.max(0, economiaTotal);
    let economiaMensalMedia = (fluxoTotalAtual - fluxoTotalNovo) / prazo;
    let economiaMensalExibida = Math.max(0, economiaMensalMedia);

    let limiteMinEconomia = economiaMensalExibida * 0.92;
    let limiteMaxEconomia = economiaMensalExibida * 1.08;

    const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    resEconomiaTotal.textContent = BRL.format(economiaTotalExibida);
    resEconomiaMensalFaixa.textContent = `R$ ${BRL.format(Math.max(0, limiteMinEconomia))} a R$ ${BRL.format(limiteMaxEconomia)} /mês`;
    resParcelaAtual.textContent = `R$ ${BRL.format(parcelaAtualEst)}`;
    resParcelaNova.textContent = `R$ ${BRL.format(parcelaNovaEst)}`;
    resEconomiaMensal.textContent = `R$ ${BRL.format(economiaMensalExibida)}/mês`;
    resCustosExtras.textContent = `R$ ${BRL.format(totalAjustesCusto)}/mês`;
}

function renderizarGraficos(labels, sacData, priceData, destData, totalJuros, saldoInicial) {
    if (lineChartInstance) lineChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    const ctxLinha = document.getElementById('chart-amortizacao-linha').getContext('2d');
    lineChartInstance = new Chart(ctxLinha, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'SAC Sem Aportes',
                    data: sacData,
                    borderColor: '#94a3b8',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'PRICE Sem Aportes',
                    data: priceData,
                    borderColor: '#cbd5e1',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                },
                {
                    label: 'Cenário com Amortizações',
                    data: destData,
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
                legend: { position: 'top', labels: { font: { size: 10, family: 'Plus Jakarta Sans' } } }
            },
            scales: {
                x: {
                    ticks: { autoSkip: true, maxTicksLimit: 12, font: { size: 9, family: 'Plus Jakarta Sans' } },
                    grid: { display: false }
                },
                y: {
                    ticks: { font: { size: 9, family: 'Plus Jakarta Sans' } }
                }
            }
        }
    });

    const ctxRosca = document.getElementById('chart-amortizacao-rosca').getContext('2d');
    pieChartInstance = new Chart(ctxRosca, {
        type: 'doughnut',
        data: {
            labels: ['Amortização Real', 'Juros Cobrados'],
            datasets: [{
                data: [saldoInicial, totalJuros],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 10, family: 'Plus Jakarta Sans' } } }
            }
        }
    });
}

function calcularDestruidor() {
    const saldo = Math.max(0, parseBRL(destSaldo.value));
    const taxaAnual = Math.max(0, parseBRL(destTaxa.value));
    const prazo = capPrazo(parseInt(destPrazo.value) || 0);
    const aporte = Math.max(0, parseBRL(destAporte.value));
    const sistema = destSistema.value;

    if (saldo <= 0 || prazo <= 0) return;

    const tipoTaxa = document.querySelector('input[name="tipo-taxa-dest"]:checked')?.value || 'nominal';
    const rMensal = tipoTaxa === 'nominal' ? (taxaAnual / 100) / 12 : Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1;
    const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    let sacTotalPago = 0;
    let sacTotalJuros = 0;
    let sacSaldo = saldo;
    const sacAmortizacaoFixa = saldo / prazo;
    let sacRows = [];
    let sacSaldosGrafico = [saldo];

    for (let t = 1; t <= prazo; t++) {
        const juros = sacSaldo * rMensal;
        const parcela = sacAmortizacaoFixa + juros;
        const saldoFinal = Math.max(0, sacSaldo - sacAmortizacaoFixa);
        sacRows.push({ t, sldIni: sacSaldo, pmt: parcela, juros, amort: sacAmortizacaoFixa, sldFim: saldoFinal });
        sacTotalPago += parcela;
        sacTotalJuros += juros;
        sacSaldo = saldoFinal;
        sacSaldosGrafico.push(saldoFinal);
    }

    let priceTotalPago = 0;
    let priceTotalJuros = 0;
    let priceSaldo = saldo;
    const pricePmtBase = rMensal <= 0 ? saldo / prazo : saldo * (rMensal * Math.pow(1 + rMensal, prazo)) / (Math.pow(1 + rMensal, prazo) - 1);
    let priceRows = [];
    let priceSaldosGrafico = [saldo];

    for (let t = 1; t <= prazo; t++) {
        const juros = priceSaldo * rMensal;
        const amort = pricePmtBase - juros;
        const saldoFinal = Math.max(0, priceSaldo - amort);
        priceRows.push({ t, sldIni: priceSaldo, pmt: pricePmtBase, juros, amort, sldFim: saldoFinal });
        priceTotalPago += pricePmtBase;
        priceTotalJuros += juros;
        priceSaldo = saldoFinal;
        priceSaldosGrafico.push(saldoFinal);
    }

    let destTotalPago = 0;
    let destTotalJuros = 0;
    let destSaldoAtual = saldo;
    let destRows = [];
    let destMesesAteQuitar = 0;
    let destSaldosGrafico = [saldo];

    for (let t = 1; t <= prazo; t++) {
        if (destSaldoAtual <= 0) break;

        const juros = destSaldoAtual * rMensal;
        let amortizacaoPadrao = 0;
        let pmtPadrao = 0;

        if (sistema === 'SAC') {
            amortizacaoPadrao = saldo / prazo;
            pmtPadrao = amortizacaoPadrao + juros;
        } else if (sistema === 'PRICE') {
            pmtPadrao = pricePmtBase;
            amortizacaoPadrao = pmtPadrao - juros;
        } else {
            const amortSac = saldo / prazo;
            const amortPrice = priceRows[t - 1]?.amort ?? (pricePmtBase - juros);
            amortizacaoPadrao = (amortSac + amortPrice) / 2;
            pmtPadrao = amortizacaoPadrao + juros;
        }

        let amortizacaoTotal = amortizacaoPadrao + aporte;
        let sldFim = destSaldoAtual - amortizacaoTotal;

        if (sldFim < 0) {
            amortizacaoTotal = destSaldoAtual;
            sldFim = 0;
            destTotalPago += juros + destSaldoAtual;
        } else {
            destTotalPago += pmtPadrao + aporte;
        }

        destRows.push({ t, sldIni: destSaldoAtual, pmt: pmtPadrao, aporte, juros, amort: amortizacaoTotal, sldFim });
        destTotalJuros += juros;
        destSaldoAtual = sldFim;
        destMesesAteQuitar = t;
        destSaldosGrafico.push(sldFim);
    }

    while (destSaldosGrafico.length < sacSaldosGrafico.length) {
        destSaldosGrafico.push(0);
    }

    let labelsGrafico = Array.from({ length: sacSaldosGrafico.length }, (_, i) => i === 0 ? 'Início' : `${i}º Mês`);

    cardSacTempo.textContent = `${prazo} meses`;
    cardSacTotal.textContent = `R$ ${BRL.format(sacTotalPago)}`;
    cardSacJuros.textContent = `R$ ${BRL.format(sacTotalJuros)}`;

    cardPriceTempo.textContent = `${prazo} meses`;
    cardPriceTotal.textContent = `R$ ${BRL.format(priceTotalPago)}`;
    cardPriceJuros.textContent = `R$ ${BRL.format(priceTotalJuros)}`;

    cardDestTempo.textContent = `${destMesesAteQuitar} meses`;
    cardDestTotal.textContent = `R$ ${BRL.format(destTotalPago)}`;

    const baseJurosComp = (sistema === 'SAC') ? sacTotalJuros : (sistema === 'PRICE' ? priceTotalJuros : (sacTotalJuros + priceTotalJuros)/2);
    const economiaJuros = baseJurosComp - destTotalJuros;
    cardDestEconomia.textContent = `R$ ${BRL.format(Math.max(0, economiaJuros))}`;

    renderizarGraficos(labelsGrafico, sacSaldosGrafico, priceSaldosGrafico, destSaldosGrafico, destTotalJuros, saldo);

    sacTableBody.innerHTML = '';
    priceTableBody.innerHTML = '';
    destTableBody.innerHTML = '';

    sacRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
        tr.innerHTML = `
            <td class="p-3 font-bold text-slate-500">${row.t}º</td>
            <td class="p-3 text-slate-600">R$ ${BRL.format(row.sldIni)}</td>
            <td class="p-3 text-slate-800 font-medium">
                <div>R$ ${BRL.format(row.pmt)}</div>
                <div class="text-[9px] text-slate-400">Juros: R$ ${BRL.format(row.juros)} | Amort: R$ ${BRL.format(row.amort)}</div>
            </td>
            <td class="p-3 font-semibold text-slate-900 bg-slate-50/50">R$ ${BRL.format(row.sldFim)}</td>
        `;
        sacTableBody.appendChild(tr);
    });

    priceRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
        tr.innerHTML = `
            <td class="p-3 font-bold text-slate-500">${row.t}º</td>
            <td class="p-3 text-slate-600">R$ ${BRL.format(row.sldIni)}</td>
            <td class="p-3 text-slate-800 font-medium">
                <div>R$ ${BRL.format(row.pmt)}</div>
                <div class="text-[9px] text-slate-400">Juros: R$ ${BRL.format(row.juros)} | Amort: R$ ${BRL.format(row.amort)}</div>
            </td>
            <td class="p-3 font-semibold text-slate-900 bg-slate-50/50">R$ ${BRL.format(row.sldFim)}</td>
        `;
        priceTableBody.appendChild(tr);
    });

    destRows.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-emerald-50/20 transition border-b border-slate-100";

        const totalPmt = row.pmt + row.aporte;

        tr.innerHTML = `
            <td class="p-3 font-bold text-slate-500">${row.t}º</td>
            <td class="p-3 text-slate-600">R$ ${BRL.format(row.sldIni)}</td>
            <td class="p-3 text-slate-800 font-medium">
                <div class="font-bold">R$ ${BRL.format(totalPmt)}</div>
                <div class="text-[9px] text-emerald-600">Aporte: R$ ${BRL.format(row.aporte)} | Juros: R$ ${BRL.format(row.juros)}</div>
            </td>
            <td class="p-3 font-bold text-emerald-900 bg-emerald-50/40">R$ ${BRL.format(row.sldFim)}</td>
        `;
        destTableBody.appendChild(tr);
    });
}

function gerarPDF() {
    const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    const pdfContainer = document.createElement('div');
    pdfContainer.className = "p-8 bg-white text-slate-800 font-sans leading-relaxed text-sm";

    let htmlContent = "";

    if (activeTab === 'portabilidade') {
        htmlContent = `
            <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0;">Amortização <span style="color: #10b981;">Financeira</span></h1>
                <p style="font-size: 11px; color: #64748b; margin: 5px 0 0 0;">Análise técnica de viabilidade e portabilidade imobiliária - Data: 2026</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h2 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">Dados do Contrato Original</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <tr style="background-color: #f8fafc;">
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Saldo Devedor Declarado:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${BRL.format(parseFloat(inputSaldoDevedor.value))}</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Prazo Restante:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${inputPrazoRestante.value} meses</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Taxa de Juros Atual:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${inputTaxaAtual.value}% a.a.</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Amortização:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${selectAmortizacao.value}</td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #14532d; margin: 0 0 8px 0; text-transform: uppercase;">Economia Líquida Estimada</h3>
                <p style="font-size: 18px; font-weight: 800; color: #16a34a; margin: 0 0 4px 0;">Até R$ ${resEconomiaTotal.textContent}</p>
                <p style="font-size: 10px; color: #15803d; margin: 0;">Faixa estimada de redução mensal nas parcelas: <strong>${resEconomiaMensalFaixa.textContent}</strong></p>
            </div>

            <div style="margin-bottom: 25px;">
                <h2 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">Projeções das Parcelas</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
                    <thead>
                        <tr style="background-color: #f1f5f9;">
                            <th style="padding: 8px; border: 1px solid #e2e8f0;">Detalhamento das Parcelas</th>
                            <th style="padding: 8px; border: 1px solid #e2e8f0;">Financiamento Atual</th>
                            <th style="padding: 8px; border: 1px solid #e2e8f0; color: #16a34a;">Proposta Portabilidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Nova Taxa Nominal Proposta</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">${inputTaxaAtual.value}% a.a.</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 700;">${inputTaxaNova.value}% a.a.</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Primeira Parcela Estimada</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">${resParcelaAtual.textContent}</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 700;">${resParcelaNova.textContent}</td>
                        </tr>
                        <tr style="background-color: #f8fafc;">
                            <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 600;">Economia Mensal Média</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0;">-</td>
                            <td style="padding: 8px; border: 1px solid #e2e8f0; color: #16a34a; font-weight: 700;">${resEconomiaMensal.textContent}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else {
        const imgLinhaBase64 = lineChartInstance ? lineChartInstance.toBase64Image() : '';
        const imgRoscaBase64 = pieChartInstance ? pieChartInstance.toBase64Image() : '';

        htmlContent = `
            <div style="border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0;">Amortização <span style="color: #10b981;">Financeira</span></h1>
                <p style="font-size: 11px; color: #64748b; margin: 5px 0 0 0;">Análise de aceleração de quitação com aportes recorrentes - Data: 2026</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h2 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">Configurações do Estudo</h2>
                <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                    <tr style="background-color: #f8fafc;">
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Saldo Devedor Inicial:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${BRL.format(parseFloat(destSaldo.value))}</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Prazo Original:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${destPrazo.value} meses</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Taxa de Juros Aplicada:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0;">${destTaxa.value}% a.a.</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: 600;">Aporte Mensal Extra:</td>
                        <td style="padding: 6px; border: 1px solid #e2e8f0; color: #10b981; font-weight: 700;">${BRL.format(parseFloat(destAporte.value))}</td>
                    </tr>
                </table>
            </div>

            <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <h3 style="font-size: 12px; font-weight: 700; color: #064e3b; margin: 0 0 8px 0; text-transform: uppercase;">Resultado do Planejamento Acelerado</h3>
                <p style="font-size: 18px; font-weight: 800; color: #059669; margin: 0 0 4px 0;">Quitação total em apenas ${cardDestTempo.textContent}!</p>
                <p style="font-size: 10px; color: #047857; margin: 0;">Sua economia estimada de juros será de: <strong>${cardDestEconomia.textContent}</strong></p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
                    <h4 style="font-size: 10px; font-weight: 700; color: #64748b; margin-top: 0; margin-bottom: 10px; text-transform: uppercase;">Curva de Saldo Devedor</h4>
                    <img src="${imgLinhaBase64}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; max-height: 180px;" />
                </div>
                <div style="border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; text-align: center;">
                    <h4 style="font-size: 10px; font-weight: 700; color: #64748b; margin-top: 0; margin-bottom: 10px; text-transform: uppercase;">Composição dos Pagamentos</h4>
                    <img src="${imgRoscaBase64}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; max-height: 180px;" />
                </div>
            </div>
        `;
    }

    htmlContent += `
        <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 9px; color: #94a3b8; text-align: justify; line-height: 1.4;">
            <p style="margin: 0 0 6px 0; font-weight: 700;">Isenção de Responsabilidade e Termos:</p>
            <p style="margin: 0;">Este planejamento constitui um estudo de viabilidade estritamente teórico baseado nas equações financeiras aplicadas às tabelas SAC/Price sob condições normais de mercado. Os dados expressos não constituem uma garantia contratual, promessa de quitação de dívida ou oferta vinculante por parte do portal Amortização Financeira. A portabilidade imobiliária está condicionada a análises cadastrais individuais conduzidas pelas instituições financeiras envolvidas, além de taxas adicionais de avaliação física e cartorárias de acordo com a Resolução CMN nº 4.292/2013.</p>
        </div>
    `;

    pdfContainer.innerHTML = htmlContent;

    const opt = {
        margin:       12,
        filename:     activeTab === 'portabilidade' ? 'Portabilidade_Amortizacao_Financeira.pdf' : 'Planejamento_Amortizacao_Acelerada.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(pdfContainer).set(opt).save();
}

function verificarCookies() {
    if (!localStorage.getItem('lgpd_cookies_aceitos')) {
        const banner = document.getElementById('lgpd-cookie-banner');
        setTimeout(() => {
            banner.classList.remove('hidden');
            banner.classList.remove('translate-y-full');
        }, 1000);
    }
}

function aceitarCookies() {
    localStorage.setItem('lgpd_cookies_aceitos', 'true');
    const banner = document.getElementById('lgpd-cookie-banner');
    banner.classList.add('translate-y-full');
    setTimeout(() => {
        banner.classList.add('hidden');
    }, 300);
}

let currentCarouselIndex = 0;
const totalSlides = 7;

function getSlidesPerView() {
    return (window.innerWidth >= 768) ? 2 : 1;
}

function updateCarouselPosition() {
    const track = document.getElementById('artigos-track');
    if (!track) return;
    const spv = getSlidesPerView();
    const maxIndex = totalSlides - spv;

    if (currentCarouselIndex > maxIndex) currentCarouselIndex = maxIndex;
    if (currentCarouselIndex < 0) currentCarouselIndex = 0;

    const percentage = -(currentCarouselIndex * (100 / totalSlides));
    track.style.transform = `translateX(${percentage}%)`;
}

function carouselNext() {
    const spv = getSlidesPerView();
    const maxIndex = totalSlides - spv;
    if (currentCarouselIndex < maxIndex) {
        currentCarouselIndex++;
    } else {
        currentCarouselIndex = 0;
    }
    updateCarouselPosition();
}

function carouselPrev() {
    if (currentCarouselIndex > 0) {
        currentCarouselIndex--;
    } else {
        const spv = getSlidesPerView();
        currentCarouselIndex = totalSlides - spv;
    }
    updateCarouselPosition();
}

setInterval(() => {
    carouselNext();
}, 5000);

window.addEventListener('resize', updateCarouselPosition);

const dbArtigos = [
    {
        titulo: "Como Pagar Seu Financiamento Imobiliário em Metade do Tempo",
        conteudo: `
            <h2 class="text-xl font-bold mb-4 text-slate-800">Como Pagar Seu Financiamento Imobiliário em Metade do Tempo</h2>
            <p class="text-xs text-slate-400 mb-4">Por Especialista em Planejamento Patrimonial</p>
            <p class="text-sm mb-4 leading-relaxed">Você sabia que a maior parte das parcelas iniciais do seu financiamento é composta puramente por juros e taxas, e não pelo abatimento da sua dívida real? É por isso que você sente que paga há anos e o saldo devedor quase não cai.</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">A Estratégia de Ouro: Amortização Extraordinária</h3>
            <p class="text-sm mb-4 leading-relaxed">A forma mais rápida de quitar a sua dívida imobiliária é realizar <strong>amortizações extras</strong>. Toda vez que você junta um dinheiro sobressalente (como o 13º salário, férias ou bônus) e amortiza, esse dinheiro é deduzido <strong>diretamente do seu saldo devedor principal</strong>, e não das parcelas futuras normais.</p>
            <p class="text-sm mb-4 leading-relaxed">Ao reduzir o saldo devedor principal diretamente, os juros que incidem nos meses seguintes caem drasticamente, criando um efeito de bola de neve altamente positivo a seu favor.</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">Amortizar Prazo vs. Parcela</h3>
            <p class="text-sm mb-4 leading-relaxed">Geralmente os bancos oferecem duas opções: reduzir o valor das parcelas mensais ou reduzir o prazo restante do financiamento. Para quem deseja <strong>economizar o máximo de juros possível</strong>, a redução de <strong>prazo</strong> é disparadamente a melhor alternativa, pois remove meses inteiros de cobranças de taxas administrativas e seguros obrigatórios adicionais.</p>
        `
    },
    {
        titulo: "Descubra Como Reduzir os Juros do Seu Imóvel por Meio da Portabilidade",
        conteudo: `
            <h2 class="text-xl font-bold mb-4 text-slate-800">Descubra Como Reduzir os Juros do Seu Imóvel</h2>
            <p class="text-xs text-slate-400 mb-4">Por Auditor de Crédito Habitacional</p>
            <p class="text-sm mb-4 leading-relaxed">Muitos compradores adquirem seus imóveis em momentos de taxas de juros elevadas no mercado (como períodos em que a Taxa Selic está em alta). O que a maioria esquece é que você não é obrigado a carregar essa taxa contratada original pelos próximos 30 anos.</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">O que é a Portabilidade de Financiamento?</h3>
            <p class="text-sm mb-4 leading-relaxed">Instituída por regras estritas do Banco Central (Resolução CMN nº 4.292/2013), a portabilidade de crédito permite que você migre sua dívida habitacional para qualquer banco concorrente que ofereça taxas de juros mais baratas e condições mais atraentes.</p>
            <p class="text-sm mb-4 leading-relaxed">O banco de origem não pode recusar a transferência, embora ele possa tentar fazer uma contraproposta para manter você como cliente — o que também é excelente, pois ajuda você a renegociar taxas sem precisar mudar de banco.</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">Principais Cuidados no Processo</h3>
            <p class="text-sm mb-4 leading-relaxed">Ao calcular a portabilidade, é fundamental não olhar apenas a taxa nominal de juros, mas sim o <strong>Custo Efetivo Total (CET)</strong>. Verifique o valor dos seguros obrigatórios (MIP/DFI) e as taxas de administração mensal do novo banco parceiro, pois esses encargos adicionais podem mascarar o desconto real da taxa proposta.</p>
        `
    },
    {
        titulo: "Vale a Pena Quitar o Financiamento Antes do Prazo ou Deixar o Dinheiro Investido?",
        conteudo: `
            <h2 class="text-xl font-bold mb-4 text-slate-800">Vale a Pena Quitar o Financiamento Antes do Prazo?</h2>
            <p class="text-xs text-slate-400 mb-4">Por Consultor de Finanças Pessoais</p>
            <p class="text-sm mb-4 leading-relaxed">Esta é uma das perguntas mais clássicas de fóruns e discussões financeiras: se eu receber uma quantia substancial, vale mais a pena quitar o meu financiamento imobiliário ou investir esse capital no mercado financeiro?</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">A Regra Prática de Comparação de Taxas</h3>
            <p class="text-sm mb-4 leading-relaxed">Para fazer essa conta com exatidão matemática, você deve comparar a taxa de juros real do seu financiamento (CET) com o rendimento líquido (já descontado o Imposto de Renda) de um investimento seguro de renda fixa (como o Tesouro Selic ou CDBs com liquidez).</p>
            <p class="text-sm mb-4 leading-relaxed">Se o Custo Efetivo do seu financiamento for de 10.5% ao ano e o seu investimento líquido render menos que isso, **amortizar a dívida é o investimento mais rentável**, pois garante um "retorno" livre de impostos equivalente à taxa de juros que você deixou de pagar ao banco.</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">O Fator Psicológico e a Paz de Espírito</h3>
            <p class="text-sm mb-4 leading-relaxed">Além da matemática pura, ter um patrimônio livre de dívidas reduz drasticamente o estresse financeiro familiar. Em momentos de incerteza econômica ou perda de renda, não ter uma parcela pesada de financiamento imobiliário batendo à sua porta todo mês confere uma blindagem patrimonial imensurável.</p>
        `
    },
    {
        titulo: "Entenda a Amortização: Guia Simples para Economizar",
        conteudo: `
            <h2 class="text-xl font-bold mb-4 text-slate-800">Entenda a Amortização: Guia Simples para Economizar</h2>
            <p class="text-xs text-slate-400 mb-4">Por Editoria de Conteúdo Amortização Financeira</p>
            <p class="text-sm mb-4 leading-relaxed">Amortizar significa, de forma literal, diminuir o valor de uma dívida de maneira gradual e estruturada até a sua total liquidação.</p>
            <h3 class="text-base font-bold mb-2 text-slate-800">Como as tabelas SAC e Price reagem</h3>
            <p class="text-sm mb-4 leading-relaxed">No Brasil, os dois sistemas de amortização mais comuns são o SAC (Sistema de Amortização Constante) e a Tabela Price. Compreender a diferença básica entre eles ajuda a traçar estratégias de economia eficientes:</p>
            <ul class="list-disc pl-5 text-sm mb-4 space-y-2 leading-relaxed">
                <li><strong>SAC:</strong> A cota de amortização é fixa. Isso significa que todo mês você abate o mesmo valor absoluto do seu saldo devedor, fazendo com que as parcelas sejam decrescentes a cada prestação paga.</li>
                <li><strong>Price:</strong> As prestações são constantes. Inicialmente, quase a totalidade da sua parcela vai para pagar os juros, amortizando uma fração mínima do saldo devedor principal.</li>
            </ul>
            <p class="text-sm mb-4 leading-relaxed">Independentemente do método contratado, o grande segredo para poupar reside em injetar aportes diretos extras no saldo devedor principal sempre que possível, encurtando o prazo de quitação e livrando-se de juros acumulados no tempo.</p>
        `
    }
];

function openArticle(index) {
    const modal = document.getElementById('article-modal');
    const content = document.getElementById('article-modal-content');
    content.innerHTML = dbArtigos[index].conteudo;
    modal.classList.remove('hidden');
}

function closeArticleModal() {
    document.getElementById('article-modal').classList.add('hidden');
}

function toggleFaq(id) {
    const content = document.getElementById(`faq-content-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-45');
        icon.setAttribute('data-lucide', 'x');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-45');
        icon.setAttribute('data-lucide', 'plus');
    }
    lucide.createIcons();
}

inputSaldoDevedor.addEventListener('input', calcularPortabilidade);
inputPrazoRestante.addEventListener('input', calcularPortabilidade);
inputTaxaAtual.addEventListener('input', calcularPortabilidade);
selectAmortizacao.addEventListener('change', calcularPortabilidade);
inputTaxaAdm.addEventListener('input', calcularPortabilidade);
inputSeguroMip.addEventListener('input', calcularPortabilidade);
inputTaxaNova.addEventListener('input', calcularPortabilidade);

destSaldo.addEventListener('input', calcularDestruidor);
destTaxa.addEventListener('input', calcularDestruidor);
destPrazo.addEventListener('input', calcularDestruidor);
destAporte.addEventListener('input', calcularDestruidor);
destSistema.addEventListener('change', calcularDestruidor);

document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('lead-nome').value;
    const whatsapp = document.getElementById('lead-whatsapp').value;
    const parcelaAtual = document.getElementById('lead-parcela-atual').value;

    const economiaTotal = document.getElementById('res-economia-total').textContent;
    const parcelaNova = document.getElementById('res-parcela-nova').textContent;

    const mensagem = `Olá! Acabei de fazer uma simulação no site *Amortização Financeira* e gostaria de uma análise:%0A%0A` +
                     `*Nome:* ${nome}%0A` +
                     `*WhatsApp:* ${whatsapp}%0A` +
                     `*Parcela Atual:* R$ ${parcelaAtual}%0A` +
                     `*Economia Estimada:* R$ ${economiaTotal}%0A` +
                     `*Nova Parcela:* ${parcelaNova}%0A%0A` +
                     `Poderia analisar meu caso?`;

    const btn = this.querySelector('button');
    btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin text-emerald-400"></i> Abrindo WhatsApp...';
    lucide.createIcons();

    setTimeout(() => {
        const seuNumero = "5511999999999";
        window.open(`https://wa.me/${seuNumero}?text=${mensagem}`, '_blank');

        document.getElementById('success-modal').classList.remove('hidden');
        btn.innerHTML = '<i data-lucide="send" class="w-4 h-4 text-emerald-400"></i> Solicitar Análise de Especialista';
        lucide.createIcons();
        this.reset();
    }, 1000);

    fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, whatsapp, parcelaAtual, economiaTotal, parcelaNova, data: new Date().toISOString() })
    }).catch(() => {});
});

function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
    const btn = document.querySelector('#lead-form button');
    btn.innerHTML = '<i data-lucide="send" class="w-4 h-4 text-emerald-400"></i> Solicitar Análise de Especialista';
    btn.classList.replace('bg-emerald-950', 'bg-slate-900');
    lucide.createIcons();
    calcularPortabilidade();
    calcularDestruidor();
}

function autoAriaLabels() {
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (!el.hasAttribute('aria-label')) {
            const label = el.closest('.group')?.querySelector('label');
            if (label) {
                el.setAttribute('aria-label', label.textContent.trim());
            }
        }
    });
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
            const icon = btn.querySelector('[data-lucide]');
            if (icon) {
                btn.setAttribute('aria-label', 'Fechar');
            }
        }
    });
}

document.querySelectorAll('input[name="tipo-taxa-port"]').forEach(el => {
    el.addEventListener('change', calcularPortabilidade);
});
document.querySelectorAll('input[name="tipo-taxa-dest"]').forEach(el => {
    el.addEventListener('change', calcularDestruidor);
});

window.onload = function() {
    verificarCookies();
    autoAriaLabels();
    calcularPortabilidade();
    calcularDestruidor();
}
