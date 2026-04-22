import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QR Kod Oluşturucu — Anında QR Kod Üretin",
  description:
    "Metin veya URL girerek anında yüksek kaliteli QR kod oluşturun. PNG olarak indirin, ücretsiz ve hızlı.",
  keywords: ["qr kod", "qr code generator", "qr oluşturucu", "qr kod indir"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
