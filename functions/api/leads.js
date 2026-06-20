export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-admin-token'
            }
        });
    }

    if (request.method === 'POST') return handlePost(request, env);
    if (request.method === 'GET') return handleGet(request, env);

    return new Response('Método não permitido', { status: 405 });
}

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

async function handlePost(request, env) {
    const body = await request.json();
    const { nome, whatsapp, parcelaAtual, economiaTotal, parcelaNova, data } = body;

    if (!nome || !whatsapp) {
        return new Response(JSON.stringify({ error: 'Nome e WhatsApp são obrigatórios' }), {
            status: 400, headers: corsHeaders
        });
    }

    const nomeTrim = nome.trim().slice(0, 100);
    const whatsappClean = whatsapp.replace(/\D/g, '').slice(0, 15);
    if (whatsappClean.length < 10) {
        return new Response(JSON.stringify({ error: 'WhatsApp inválido. Informe um número com DDD (ex: 5511999999999).' }), {
            status: 400, headers: corsHeaders
        });
    }

    const lead = {
        nome: nomeTrim, whatsapp: whatsappClean,
        parcelaAtual, economiaTotal, parcelaNova,
        data: data || new Date().toISOString(),
        ip: request.headers.get('CF-Connecting-IP') || ''
    };

    try {
        const leads = JSON.parse(await env.LEADS.get('leads') || '[]');
        leads.push(lead);
        await env.LEADS.put('leads', JSON.stringify(leads));
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Erro interno ao salvar lead' }), {
            status: 500, headers: corsHeaders
        });
    }
}

async function handleGet(request, env) {
    const url = new URL(request.url);
    const auth = url.searchParams.get('token') || request.headers.get('x-admin-token');

    if (auth !== env.ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: 'Acesso não autorizado' }), {
            status: 403, headers: corsHeaders
        });
    }

    try {
        const leads = JSON.parse(await env.LEADS.get('leads') || '[]');
        return new Response(JSON.stringify(leads), { status: 200, headers: corsHeaders });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Erro ao ler leads' }), {
            status: 500, headers: corsHeaders
        });
    }
}
