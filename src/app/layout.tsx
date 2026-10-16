import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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

// Pinta a barra do navegador no celular com o fundo do site e avisa ao
// navegador que a página é escura (scrollbars, inputs nativos etc.).
export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={jetbrainsMono.variable}>
      <body className="bg-term-bg text-term-dim font-mono min-h-screen antialiased selection:bg-term-green selection:text-black flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
