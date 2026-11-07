import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BCTech | BritosCode HQ",
    template: "%s | BCTech",
  },
  description:
    "Ecossistema multi-SaaS da BritosCode.tech: BCModas, BC Health e BCTech Core com infraestrutura isolada, backups automatizados e suporte humano.",
  applicationName: "BCTech",
  authors: [{ name: "BritosCode.tech" }],
  keywords: [
    "BritosCode",
    "BCTech",
    "SaaS",
    "ERP",
    "gestão clínica",
    "confecção",
    "multi-tenant",
  ],
  openGraph: {
    title: "BCTech | BritosCode HQ",
    description:
      "Software sob medida e infraestrutura isolada para operações que não podem parar.",
    type: "website",
    locale: "pt_BR",
    siteName: "BCTech",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
