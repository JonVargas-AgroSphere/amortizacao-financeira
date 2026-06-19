# Relatório de Auditoria Rigorosa — Calculadoras Imobiliárias

**Data:** 18/06/2026  
**Arquivo auditado:** `assets/js/app.js` (único arquivo com lógica de cálculos)  
**Escopo:** `calcularPortabilidade()` e `calcularDestruidor()`

---

## SUMÁRIO EXECUTIVO

| Gravidade | Qtde | Descrição |
|-----------|------|-----------|
| 🔴 **Crítico** | 3 | Risco legal iminente — resultados incorretos ou enganosos |
| 🟡 **Alto** | 2 | Risco de má interpretação — pode induzir decisão errada |
| 🟠 **Médio** | 3 | Falta de conformidade legal ou clareza |
| 🔵 **Baixo** | 3 | Melhorias de UX/documentação |

---

## 🔴 PROBLEMAS CRÍTICOS

### C1. Conversão Taxa Anual → Mensal: Nominal vs Efetiva (RISCO LEGAL GRAVE)

**Local:** `app.js:182-183` (Portabilidade), `app.js:329` (Destruidor)  
**Fórmula atual:** `Math.pow(1 + (taxaAnual / 100), 1 / 12) - 1`

**O problema:** O código trata TODAS as taxas como **efetivas anuais**, convertendo para mensal com `(1+i)^(1/12)-1`. Porém, no mercado imobiliário brasileiro, os bancos usam **taxa nominal anual** (juros simples proporcionais), onde a taxa mensal = taxa anual ÷ 12.

**Confirmação matemática (teste com 10,5% a.a.):**

| Métrica | Efetiva (app) | Nominal (mercado) | Diferença |
|---------|:------------:|:-----------------:|:---------:|
| Taxa mensal | 0,8355% | 0,8750% | **-4,51%** |
| Parcela Price | R$ 2.900,27 | R$ 2.995,14 | **-R$ 94,87/mês** |
| Total SAC pago | R$ 602.038,88 | R$ 616.312,50 | **-R$ 14.273,62** |
| Economia portabilidade | R$ 68.662,52 | R$ 75.654,16 | **-R$ 6.991,64** |

**Risco legal:**  
- Se o usuário informa taxa NOMINAL (padrão do mercado), a calculadora SUBESTIMA os juros reais  
- As parcelas calculadas são MENORES que a realidade → falsa sensação de economia  
- Usuário pode tomar decisão financeira (contratar portabilidade, fazer aportes) baseado em números incorretos  
- Em ação judicial, perícia contábil identificaria o erro matemático

**Tooltip contraditória:**  
- Portabilidade diz: *"Custo Efetivo Total (CET) anual"* (linha 166) → sugere taxa efetiva  
- Destruidor diz: *"Taxa de juros anual nominal"* (linha 525) → sugere taxa nominal  
- O usuário não sabe qual está correta

**Correção sugerida:**  
1. Adicionar seletor: "Tipo de Taxa: ○ Nominal (padrão mercado) ○ Efetiva (CET)"  
2. Converter adequadamente: `nominal → i/12`, `efetiva → (1+i)^(1/12)-1`  
3. Ou adotar nominal como padrão (mais conservador para o usuário) e documentar

---

### C2. Bug no Cálculo do Total Pago — Destruidor (app.js:403)

**Local:** `app.js:403`  
**Código problemático:**
```javascript
destTotalPago += pmtPadrao + (destSaldoAtual >= amortizacaoTotal ? aporte : (destSaldoAtual - amortizacaoPadrao));
```

**O bug:** Quando o saldo remanescente no último mês é menor que a amortização total planejada, o código ajusta `amortizacaoTotal = destSaldoAtual`. Então a condição `destSaldoAtual >= amortizacaoTotal` vira `destSaldoAtual >= destSaldoAtual` = `true`, e o código adiciona o `aporte` **completo** mesmo que parte dele não tenha sido usada.

**Confirmação (teste: R$ 300k, 240m, 10,5% a.a., aporte R$ 500):**
- Total a pagar com bug: R$ 517.101,92  
- Total a pagar correto: R$ 516.101,92  
- **Erro: R$ 1.000,00** (2 meses finais com aporte completo contabilizado indevidamente)

**Impacto:** O valor exibido em `cardDestTotal` e `cardDestEconomia` está incorreto. Felizmente o erro é pequeno em termos relativos (~0,2%), mas é um erro matemático.

---

### C3. Sistema Misto (SAM) — Implementação Não Padrão (app.js:388-391)

**Local:** `app.js:388-391`  
**Código:**
```javascript
const pmtSac = (saldo / prazo) + juros;
pmtPadrao = (pmtSac + pricePmtBase) / 2;
amortizacaoPadrao = pmtPadrao - juros;
```

**O problema:** O código implementa o SAM como **média aritmética das parcelas** SAC e PRICE. No Brasil, o Sistema de Amortização Misto (SAM) é definido como a **média das amortizações** SAC e PRICE, não das parcelas. A diferença é sutil mas importante: a amortização varia de forma diferente.

**Risco:** Usuários que selecionam "SAM Misto" podem estar vendo resultados que não correspondem a nenhum sistema de amortização utilizado por bancos brasileiros. A própria descrição na UI ("Média de Amortização + Aporte Extra") sugere que deveria ser média de amortizações, não de parcelas.

---

## 🟡 PROBLEMAS DE ALTO RISCO

### A1. Faixa de ±8% sem Fundamento Matemático (app.js:227-228)

**Local:** `app.js:227-228`  
**Código:**
```javascript
let limiteMinEconomia = economiaMensalExibida * 0.92;
let limiteMaxEconomia = economiaMensalExibida * 1.08;
```

**O problema:** Exibir uma faixa de "R$ X a R$ Y /mês" com ±8% sem qualquer análise de sensibilidade, distribuição estatística ou fundamentação técnica é potencialmente enganoso. Um usuário pode interpretar como "garantia" de que a economia ficará nessa faixa.

**Sugestão:** Substituir por "economia média estimada" ou implementar análise de sensibilidade real (variação de taxa, prazo, etc.).

---

### A2. Rótulo Incorreto no Gráfico de Rosca (app.js:302-304)

**Local:** `app.js:304`  
**Código:**
```javascript
data: [saldoInicial, totalJuros],
labels: ['Amortização Real', 'Juros Cobrados'],
```

**O problema:** O label "Amortização Real" usa `saldoInicial`, que é o valor principal inicial, não a amortização real efetuada. O correto seria "Valor Principal" ou "Saldo Devedor Inicial". "Amortização Real" dá a falsa impressão de que houve amortização desse valor, quando na verdade é apenas o saldo inicial antes de qualquer pagamento.

---

## 🟠 PROBLEMAS MÉDIOS

### M1. Ausência de CET (Custo Efetivo Total)

**Exigência legal:** A Resolução CMN nº 4.292/2013 e normas do BACEN exigem que simulações de crédito apresentem o CET. A calculadora não calcula nem exibe o CET (que incluiria: taxa de juros + taxa de administração + seguros + tributos).

**Risco:** Em eventual fiscalização ou ação judicial, a ausência do CET pode ser usada contra o site.

---

### M2. Ajustes na Portabilidade — Comportamento Ambíguo (app.js:199-203)

`totalAjustesCusto` é adicionado apenas à parcela do novo banco. A UI permite "+" e "-", sugerindo que o ajuste representa diferenças entre bancos. Porém:
- Se ajuste for "+ R$ 50" (custo que só o novo banco cobra) → comportamento correto  
- Se ajuste for "- R$ 50" (desconto que o novo banco oferece) → o código desconta da parcela NOVA, o que é correto  
- Mas a UI não explica claramente que o ajuste SEMPRE se refere à proposta nova

---

### M3. Nenhuma Validação de Entrada

- Taxas negativas são aceitas  
- Prazos zerados ou negativos não são validados adequadamente  
- Aportes maiores que o saldo são aceitos (só são tratados internamente)  
- Percentuais acima de 100% são aceitos

---

## 🔵 PROBLEMAS BAIXOS

### B1. `useCORS: true` no html2pdf (app.js:617)

Pode causar falha na geração de PDF com gráficos em alguns navegadores.

### B2. Ausência de Testes Automatizados

Não há testes unitários ou de integração. Qualquer alteração na lógica de cálculos pode introduzir bugs silenciosos.

### B3. Carrossel de Artigos com `setInterval` (app.js:682-684)

O carrossel roda a cada 5s mesmo com a aba oculta ou página em background, consumindo recursos desnecessários.

---

## VERIFICAÇÕES MATEMÁTICAS QUE PASSARAM (OK)

| Verificação | Resultado |
|------------|:---------:|
| Fórmula PRICE (PMT = SD × r × (1+r)^n / ((1+r)^n - 1)) | ✅ Correta |
| Soma parcelas SAC = SD + total_juros | ✅ Perfeito (diferença zero) |
| Soma parcelas PRICE = n × PMT | ✅ Perfeito |
| SAC: Amortização constante = SD / n | ✅ Correta |
| SAC: Saldo final = saldo inicial - amortização | ✅ Correta |
| PRICE: Amortização = PMT - juros | ✅ Correta |
| PRICE: Juros decrescentes com saldo | ✅ Correta |
| Cap de amortização no último mês (saldo não fica negativo) | ✅ Correta |
| Gráfico de linha (evolução do saldo) | ✅ Correta |

---

## RECOMENDAÇÕES PRIORITÁRIAS

### Imediatas (risco legal)

1. **Corrigir conversão de taxa (C1):** Adicionar seletor nominal/efetiva. Enquanto não implementa, documentar EXPLICITAMENTE no tooltip: *"Informe a taxa EFETIVA anual (CET). Se seu contrato usa taxa nominal, ela é ~4,5% menor que a efetiva."*

2. **Corrigir bug do total pago (C2):** No `calcularDestruidor`, quando `sldFim < 0`, usar:
   ```javascript
   destTotalPago += juros + destSaldoAtual;  // paga só o que falta
   ```
   em vez da lógica atual com aporte condicional.

3. **Corrigir/remover SAM (C3):** Ou implementar o SAM conforme definição brasileira (média das amortizações) ou remover a opção até que esteja correta.

### Curto prazo

4. Adicionar CET nos resultados
5. Remover faixa de ±8% (substituir por valor médio apenas)
6. Corrigir label do gráfico de rosca para "Valor Principal"
7. Adicionar validações de entrada básicas

### Médio prazo

8. Criar testes unitários para todas as funções matemáticas
9. Revisar tooltips para consistência (nominal vs efetiva)

---

## CONCLUSÃO

A base matemática (fórmulas SAC e PRICE) está **correta**. Os dois problemas críticos são:

1. **C1** (conversão nominal/efetiva): Pode fazer o usuário tomar decisão errada com diferenças de **R$ 6 mil a R$ 14 mil** no cenário testado. **Prioridade máxima.**
2. **C2** (bug do total pago): Erro de **R$ 1.000** no total exibido. Menor impacto mas precisa ser corrigido.

Com essas correções, as calculadoras ficam matematicamente sólidas e aptas para uso público com baixo risco legal.
