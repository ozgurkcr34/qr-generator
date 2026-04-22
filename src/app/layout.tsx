import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QR Kod Oluşturucu — Özelleştir ve İndir",
  description:
    "Metin veya URL girerek anında özelleştirilebilir QR kod oluşturun. Renk, logo, köşe yuvarlatması ve daha fazlasını ayarlayın. Yüksek kaliteli PNG olarak indirin.",
  keywords: ["qr kod", "qr code generator", "qr oluşturucu", "qr kod indir", "qr özelleştir"],
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
