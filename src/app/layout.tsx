import type { Metadata } from "next";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: ["Marlon Batalha", "Desenvolvedor Full Stack", "Full Stack Developer", "Next.js", "React", "TypeScript", "Portfólio"],
  authors: [{ name: siteName, url: siteUrl }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US"],
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: "/image/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR"className={`${jetbrainsMono.variable} ${pressStart2P.variable}`}>
      <body className="bg-[#050505] text-[#666] font-mono min-h-screen antialiased selection:bg-[#00ff88] selection:text-black flex flex-col">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
