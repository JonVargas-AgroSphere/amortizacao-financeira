import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const BASE_URL = "https://calculadoramortizacao.com.br";

export const metadata = {
  title: "Amortização Financeira | Simulador de Portabilidade e Amortização SAC/Price",
  description: "Descubra como pagar financiamento imobiliário mais rápido. Simule a portabilidade de juros, calcule amortizações extraordinárias e reduza suas parcelas mensalmente de forma simples.",
  keywords: "amortização de financiamento imobiliário, calculadora de amortização, simulador de financiamento imobiliário, tabela SAC e Price, quitação antecipada financiamento, como pagar financiamento mais rápido, como diminuir juros financiamento imobiliário, reduzir parcela financiamento imobiliário, quitar dívida imobiliária antes do prazo, adiantar parcelas financiamento, vale a pena amortizar financiamento, juros abusivos financiamento, revisão de financiamento imobiliário",
  robots: "index, follow",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Amortização Financeira | Simulador de Portabilidade e Amortização",
    description: "Descubra como pagar financiamento imobiliário mais rápido. Simule portabilidade de juros, calcule amortizações e reduza suas parcelas.",
    url: BASE_URL,
    siteName: "Amortização Financeira",
    locale: "pt_BR",
    type: "website",
    images: [{ url: `${BASE_URL}/logotipo_amortizacao_financeira.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amortização Financeira | Simulador de Portabilidade",
    description: "Descubra como pagar financiamento imobiliário mais rápido. Simule portabilidade de juros e amortizações.",
    images: [`${BASE_URL}/logotipo_amortizacao_financeira.png`],
  },
  other: {
    "application-name": "Amortização Financeira",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Amortização",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Amortização Financeira",
      url: BASE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description: "Simulador de portabilidade e amortização de financiamento imobiliário. Calcule economia de juros, compare SAC vs Price e planeje amortizações extraordinárias.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      author: { "@type": "Organization", name: "Amortização Financeira" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      ],
    },
  ];

  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} h-full`}>
      <body className="font-sans text-slate-800 min-h-full flex flex-col justify-between bg-slate-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
