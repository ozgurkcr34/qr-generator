"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode, Sparkles, Link2 } from "lucide-react";



export default function QRGenerator() {
  const [text, setText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const qrValue = text.trim();

  const handleDownload = useCallback(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;

    const canvas = wrapper.querySelector("canvas");
    if (!canvas) return;

    // Create a high-res canvas for download
    const scale = 4;
    const size = 256;
    const padding = 32;
    const totalSize = size * scale + padding * 2;

    const downloadCanvas = document.createElement("canvas");
    downloadCanvas.width = totalSize;
    downloadCanvas.height = totalSize;

    const ctx = downloadCanvas.getContext("2d");
    if (!ctx) return;

    // White background with rounded appearance
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalSize, totalSize);

    // Draw QR code centered with padding
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, padding, padding, size * scale, size * scale);

    const link = document.createElement("a");
    link.download = `qr-code-${Date.now()}.png`;
    link.href = downloadCanvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <div
        className="relative w-full max-w-md"
        style={{ animation: "fadeInUp 0.8s ease-out" }}
      >
        {/* Glassmorphism Card */}
        <div
          className="relative rounded-3xl border border-white/10 p-8 sm:p-10 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
            animation: "pulseGlow 4s ease-in-out infinite",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-400/20 mb-4">
              <QrCode className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              QR Kod Oluşturucu
            </h1>
            <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Anında oluştur, hemen indir
            </p>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center mb-8">
            <div
              className="relative group"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              {/* Glow behind QR */}
              <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* QR Frame */}
              <div
                ref={canvasWrapperRef}
                className="relative rounded-2xl border border-white/15 p-5 transition-all duration-500"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.95) 100%)",
                }}
              >
                <QRCodeCanvas
                  value={text == "" ? "Hoşgeldin topraaam" : qrValue}
                  size={200}
                  level="H"
                  marginSize={1}
                  bgColor="transparent"
                  fgColor="#1e1b4b"
                />

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400/40 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400/40 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400/40 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400/40 rounded-br-lg" />
              </div>
            </div>
          </div>

          {/* Input Field */}
          <div className="relative mb-6">
            <div
              className={`absolute -inset-0.5 rounded-2xl transition-all duration-500 ${isFocused
                ? "bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-indigo-500/50 opacity-100"
                : "bg-transparent opacity-0"
                }`}
              style={
                isFocused
                  ? {
                    backgroundSize: "200% 100%",
                    animation: "shimmer 3s linear infinite",
                  }
                  : undefined
              }
            />
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-500 pointer-events-none transition-colors duration-300">
                <Link2
                  className={`w-4.5 h-4.5 transition-colors duration-300 ${isFocused ? "text-indigo-400" : "text-slate-500"
                    }`}
                />
              </div>
              <input
                id="qr-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Bir URL veya metin girin..."
                spellCheck={false}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 text-sm font-medium outline-none transition-all duration-300 focus:bg-white/8 focus:border-transparent"
              />
            </div>
          </div>

          {/* Download Button */}
          <button
            id="download-btn"
            onClick={handleDownload}
            className="group/btn relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)",
              backgroundSize: "200% 100%",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition =
                "100% 0";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundPosition =
                "0 0";
            }}
          >
            {/* Button glow */}
            <div className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-all duration-300" />
            <Download className="w-4.5 h-4.5 relative z-10 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
            <span className="relative z-10">PNG Olarak İndir</span>
          </button>

          {/* Footer hint */}
          <p className="text-center text-xs text-slate-500 mt-5">
            Yüksek kaliteli QR kod · 1024×1024 px
          </p>
        </div>
      </div>
    </div>
  );
}
