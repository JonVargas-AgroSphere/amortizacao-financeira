/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/artigos.html',
        destination: '/artigos',
        permanent: true,
      },
      {
        source: '/manual-pratico-portabilidade.html',
        destination: '/artigos/manual-pratico-portabilidade',
        permanent: true,
      },
      {
        source: '/manual-pratico-amortizacao.html',
        destination: '/artigos/manual-pratico-amortizacao',
        permanent: true,
      },
      {
        source: '/guia-pagar-financiamento-mais-rapido.html',
        destination: '/artigos/guia-pagar-financiamento-mais-rapido',
        permanent: true,
      },
      {
        source: '/amortizacao-prazo-vs-parcela.html',
        destination: '/artigos/amortizacao-prazo-vs-parcela',
        permanent: true,
      },
      {
        source: '/tabela-sac-vs-price-comparativo.html',
        destination: '/artigos/tabela-sac-vs-price-comparativo',
        permanent: true,
      },
      {
        source: '/como-diminuir-juros-financiamento.html',
        destination: '/artigos/como-diminuir-juros-financiamento',
        permanent: true,
      },
      {
        source: '/vale-a-pena-amortizar-ou-investir.html',
        destination: '/artigos/vale-a-pena-amortizar-ou-investir',
        permanent: true,
      },
      {
        source: '/artigo-8-uso-fgts.html',
        destination: '/artigos/artigo-8-uso-fgts',
        permanent: true,
      },
      {
        source: '/artigo-9-juros-abusivos.html',
        destination: '/artigos/artigo-9-juros-abusivos',
        permanent: true,
      },
      {
        source: '/artigo-10-juros-compostos.html',
        destination: '/artigos/artigo-10-juros-compostos',
        permanent: true,
      },
      {
        source: '/artigo-como-pagar-mais-rapido.html',
        destination: '/artigos/artigo-como-pagar-mais-rapido',
        permanent: true,
      },
      {
        source: '/privacidade.html',
        destination: '/privacidade',
        permanent: true,
      },
      {
        source: '/termos.html',
        destination: '/termos',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
