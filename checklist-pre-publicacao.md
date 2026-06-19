# Checklist de Pré-Publicação

## ANTES DE SUBIR PARA PRODUÇÃO

### 🔴 OBRIGATÓRIO (substituir placeholders)

- [x] **Server injection:** `server/index.js` agora substitui placeholders via `.env` (dotenv instalado)
- [x] **.env.example:** Criado com todas as variáveis (GA4_ID, ADSENSE_CLIENT, WHATSAPP_NUMBER, SITE_DOMAIN, ADMIN_TOKEN)
- [ ] **Copiar `.env.example` para `.env` e preencher valores reais:**
  - `GA4_ID=G-XXXXXXXXXX` → Seu ID do Google Analytics
  - `ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX` → Seu ID do AdSense
  - `WHATSAPP_NUMBER=5511999999999` → Número do corretor
  - `SITE_DOMAIN=seudominio.com.br` → Domínio real
  - `ADMIN_TOKEN=<token-seguro>` → Gerar com: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [x] **Sitemap:** Já reflete `amortizacaofinanceira.com.br` (verificar se é o domínio real)
- [ ] **Server:** Definir `ADMIN_TOKEN` no `.env` com uma senha forte para proteger GET /api/leads

### 🟡 RECOMENDADO (ajustes finos)

- [x] **Canonical tags:** Adicionadas em todas as 12 páginas de artigo + index.html
- [x] **Robots meta:** Adicionado `index, follow` em todas as páginas
- [x] **Twitter Cards:** Adicionados em todas as páginas
- [x] **Structured Data (JSON-LD):** Article, CollectionPage e WebApplication conforme cada página
- [x] **Rebuild CSS:** `npm run build:css` executado
- [ ] **Codificação UTF-8:** Verificada e corrigida em todos os 13 arquivos HTML
- [ ] **HTTPS:** Configurar certificado SSL no servidor (dados de leads trafegam)
- [ ] **Logotipo fallback:** A imagem `placehold.co` no `onerror` é útil mas considera hospedar um fallback local

### 🟠 IMPORTANTE (produção)

- [ ] **Limitar prazo máximo:** Já implementado (cap 600 meses). Confirme se esse limite atende seus cenários
- [ ] **Rate limiting:** Considerar adicionar rate limit no POST /api/leads (evitar spam)
- [ ] **Sanitização de input no servidor:** Validar formato do WhatsApp no backend
- [ ] **LGPD:** Cookie banner está implementado. Confirmar se a Política de Privacidade cobre todos os dados coletados

### 🔵 NICE TO HAVE (futuro)

- [ ] **Testes a11y:** Rodar `npx pa11y https://seudominio.com.br` (pa11y já está nas devDependencies)
- [ ] **Testes unitários:** Criar testes para as funções de cálculo (já auditadas e corrigidas)
- [ ] **Remover `%APPDATA%/`**: Existe um diretório `%APPDATA%/` na raiz do projeto — verificar se é lixo

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
