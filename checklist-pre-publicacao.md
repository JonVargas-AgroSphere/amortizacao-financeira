# Checklist de Pré-Publicação

## ANTES DE SUBIR PARA PRODUÇÃO

### 🔴 OBRIGATÓRIO (substituir placeholders)

- [x] **Server injection:** `server/index.js` agora substitui placeholders via `.env` (dotenv instalado)
- [x] **.env.example:** Criado com todas as variáveis (GA4_ID, ADSENSE_CLIENT, WHATSAPP_NUMBER, SITE_DOMAIN, ADMIN_TOKEN)
- [x] **Copiar `.env.example` para `.env` e preencher valores reais:**
  - `GA4_ID=G-J6CQG19L6Z`
  - `ADSENSE_CLIENT=ca-pub-6191460191140933`
  - `WHATSAPP_NUMBER=5551989840198`
  - `SITE_DOMAIN=amortizacaofinanceira.com.br`
  - `ADMIN_TOKEN=<gerado>`
- [x] **Sitemap:** Já reflete `amortizacaofinanceira.com.br` (verificar se é o domínio real)
- [x] **Server:** Definir `ADMIN_TOKEN` no `.env` com uma senha forte para proteger GET /api/leads

### 🟡 RECOMENDADO (ajustes finos)

- [x] **Canonical tags:** Adicionadas em todas as 12 páginas de artigo + index.html
- [x] **Robots meta:** Adicionado `index, follow` em todas as páginas
- [x] **Twitter Cards:** Adicionados em todas as páginas
- [x] **Structured Data (JSON-LD):** Article, CollectionPage e WebApplication conforme cada página
- [x] **Rebuild CSS:** `npm run build:css` executado
- [x] **Codificação UTF-8:** Verificada e corrigida em todos os 15 arquivos HTML
- [x] **HTTPS:** Render.com fornece SSL automático
- [ ] **Logotipo fallback:** A imagem `placehold.co` no `onerror` é útil mas considera hospedar um fallback local

### 🟠 IMPORTANTE (produção)

- [ ] **Limitar prazo máximo:** Já implementado (cap 600 meses). Confirme se esse limite atende seus cenários
- [x] **Rate limiting:** Implementado (5 req/min por IP) no POST /api/leads
- [x] **Sanitização de input no servidor:** WhatsApp validado (10-15 dígitos), nome truncado (100 chars)
- [ ] **LGPD:** Cookie banner está implementado. Confirmar se a Política de Privacidade cobre todos os dados coletados

### 🔵 NICE TO HAVE (futuro)

- [ ] **Testes a11y:** Rodar `npx pa11y https://seudominio.com.br` (pa11y já está nas devDependencies)
- [ ] **Testes unitários:** Criar testes para as funções de cálculo (já auditadas e corrigidas)
- [x] **Remover `%APPDATA%/`**: Diretório removido e adicionado ao `.gitignore`

## RESUMO DAS CORREÇÕES JÁ APLICADAS

| O que | Arquivo | Status |
|-------|---------|--------|
| Seletor taxa nominal/efetiva | `index.html`, `app.js` | ✅ |
| Bug total pago Destruidor | `app.js` | ✅ |
| SAM corrigido (média amort) | `app.js` | ✅ |
| Divisão por zero (taxa=0) | `app.js` | ✅ |
| Validação entradas negativas | `app.js` | ✅ |
| Prazo máximo (cap 600) | `app.js` | ✅ |
| Vírgula brasileira (parseBRL) | `app.js` | ✅ |
| Overlap % a.a. nos inputs | `index.html` | ✅ |
| Auth no GET /api/leads | `server/index.js` | ✅ |
| Ad-sidebar não vazio | `index.html` | ✅ |
| Dead links artigos | `artigo-como-pagar-mais-rapido.html` | ✅ |
