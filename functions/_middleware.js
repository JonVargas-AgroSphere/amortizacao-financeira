export async function onRequest(context) {
    const { request, env, next } = context;
    const response = await next();

    const url = new URL(request.url);
    const ext = url.pathname.split('.').pop().toLowerCase();
    const isHtml = ext === 'html' || ext === '' || response.headers.get('content-type')?.includes('text/html');
    const isJs = ext === 'js' || response.headers.get('content-type')?.includes('javascript');
    if (!isHtml && !isJs) return response;

    let text = await response.text();

    text = text.replace(/G-XXXXXXXXXX/g, env.GA4_ID || 'G-XXXXXXXXXX');
    text = text.replace(/ca-pub-XXXXXXXXXXXXXXXX/g, env.ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX');
    text = text.replace(/5511999999999/g, env.WHATSAPP_NUMBER || '5511999999999');

    return new Response(text, response);
}
