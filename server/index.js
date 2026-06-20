const express = require('express');
const path = require('path');
const fs = require('fs');

try { require('dotenv').config(); } catch (_) { /* dotenv opcional */ }

const app = express();
const PORT = process.env.PORT || 3000;
const LEADS_FILE = path.join(__dirname, 'leads.json');
const ROOT = path.join(__dirname, '..');

app.use(express.json());

// Substitui placeholders em arquivos servidos estaticamente
function injectEnv(req, res, next) {
    let filePath = path.join(ROOT, req.path);
    let ext;
    if (filePath.endsWith('/') || path.extname(filePath) === '') {
        filePath = path.join(filePath, 'index.html');
        ext = '.html';
    } else {
        ext = path.extname(filePath).toLowerCase();
        if (!['.html', '.js', '.md'].includes(ext)) return next();
    }
    if (!fs.existsSync(filePath)) return next();

    const content = fs.readFileSync(filePath, 'utf-8');
    const replacements = {
        'G-XXXXXXXXXX':                 process.env.GA4_ID || 'G-XXXXXXXXXX',
        'ca-pub-XXXXXXXXXXXXXXXX':      process.env.ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX',
        '5511999999999':                process.env.WHATSAPP_NUMBER || '5511999999999',
        'seudominio.com.br':             process.env.SITE_DOMAIN || 'seudominio.com.br',
    };

    let result = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
        result = result.split(placeholder).join(value);
    }

    const mime = { '.html': 'text/html', '.js': 'application/javascript', '.md': 'text/markdown' }[ext];
    res.type(mime).send(result);
}

app.use(injectEnv);
app.use(express.static(ROOT));

if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, '[]', 'utf-8');
}

app.post('/api/leads', (req, res) => {
    const { nome, whatsapp, parcelaAtual, economiaTotal, parcelaNova, data } = req.body;

    if (!nome || !whatsapp) {
        return res.status(400).json({ error: 'Nome e WhatsApp são obrigatórios' });
    }

    const lead = { nome, whatsapp, parcelaAtual, economiaTotal, parcelaNova, data: data || new Date().toISOString(), ip: req.ip };

    try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
        leads.push(lead);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
        console.log(`[LEAD] Novo lead cadastrado: ${nome} - ${whatsapp}`);
        res.json({ success: true });
    } catch (err) {
        console.error('[ERRO] Falha ao salvar lead:', err);
        res.status(500).json({ error: 'Erro interno ao salvar lead' });
    }
});

app.get('/api/leads', (req, res) => {
    const auth = req.query.token || req.headers['x-admin-token'];
    if (auth !== process.env.ADMIN_TOKEN) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
    }
    try {
        const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao ler leads' });
    }
});

app.listen(PORT, () => {
    console.log(`Amortização Financeira rodando em http://localhost:${PORT}`);
});
