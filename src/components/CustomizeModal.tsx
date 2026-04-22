"use client";

import { useRef, useCallback, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, Upload, Trash2 } from "lucide-react";
import {
  SiInstagram,
  SiGithub,
  SiFacebook,
  SiYoutube,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiSpotify,
  SiPinterest,
  SiReddit,
  SiTelegram,
  SiDiscord,
  SiTwitch,
  SiSnapchat,
  SiThreads,
} from "react-icons/si";
import { BsLinkedin } from "react-icons/bs";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface QRSettings {
  fgColor: string;
  bgColor: string;
  cornerRadius: number;
  size: number;
  errorLevel: "L" | "M" | "Q" | "H";
  margin: number;
  showSocialIcon: boolean;
  customImage: string | null;
  customImageName: string | null;
}

export const DEFAULT_SETTINGS: QRSettings = {
  fgColor: "#000000",
  bgColor: "#FFFFFF",
  cornerRadius: 16,
  size: 1024,
  errorLevel: "H",
  margin: 2,
  showSocialIcon: true,
  customImage: null,
  customImageName: null,
};

/* ------------------------------------------------------------------ */
/*  Social media detection                                             */
/* ------------------------------------------------------------------ */

interface SocialPlatform {
  name: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 16;

const SOCIAL_MAP: Array<{ patterns: string[]; name: string; icon: React.ReactNode }> = [
  { patterns: ["instagram.com"], name: "Instagram", icon: <SiInstagram size={ICON_SIZE} /> },
  { patterns: ["twitter.com", "x.com"], name: "X / Twitter", icon: <SiX size={ICON_SIZE} /> },
  { patterns: ["youtube.com", "youtu.be"], name: "YouTube", icon: <SiYoutube size={ICON_SIZE} /> },
  { patterns: ["linkedin.com"], name: "LinkedIn", icon: <BsLinkedin size={ICON_SIZE} /> },
  { patterns: ["github.com"], name: "GitHub", icon: <SiGithub size={ICON_SIZE} /> },
  { patterns: ["tiktok.com"], name: "TikTok", icon: <SiTiktok size={ICON_SIZE} /> },
  { patterns: ["wa.me", "whatsapp.com"], name: "WhatsApp", icon: <SiWhatsapp size={ICON_SIZE} /> },
  { patterns: ["facebook.com", "fb.com"], name: "Facebook", icon: <SiFacebook size={ICON_SIZE} /> },
  { patterns: ["spotify.com"], name: "Spotify", icon: <SiSpotify size={ICON_SIZE} /> },
  { patterns: ["pinterest.com"], name: "Pinterest", icon: <SiPinterest size={ICON_SIZE} /> },
  { patterns: ["reddit.com"], name: "Reddit", icon: <SiReddit size={ICON_SIZE} /> },
  { patterns: ["t.me", "telegram.org"], name: "Telegram", icon: <SiTelegram size={ICON_SIZE} /> },
  { patterns: ["discord.gg", "discord.com"], name: "Discord", icon: <SiDiscord size={ICON_SIZE} /> },
  { patterns: ["twitch.tv"], name: "Twitch", icon: <SiTwitch size={ICON_SIZE} /> },
  { patterns: ["snapchat.com"], name: "Snapchat", icon: <SiSnapchat size={ICON_SIZE} /> },
  { patterns: ["threads.net"], name: "Threads", icon: <SiThreads size={ICON_SIZE} /> },
];

export function detectSocialPlatform(url: string): SocialPlatform | null {
  const lower = url.toLowerCase();
  for (const entry of SOCIAL_MAP) {
    if (entry.patterns.some((p) => lower.includes(p))) {
      return { name: entry.name, icon: entry.icon };
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Preset colors                                                      */
/* ------------------------------------------------------------------ */

const FG_PRESETS = ["#000000", "#1a1a1a", "#4F46E5", "#DC2626", "#059669", "#D97706", "#7C3AED", "#0284C7"];
const BG_PRESETS = ["#FFFFFF", "#F5F5F5", "#FEF3C7", "#DBEAFE", "#D1FAE5", "#FCE7F3", "#EDE9FE", "#111111"];
const SIZE_OPTIONS = [512, 1024, 2048];
const ERROR_LEVELS: Array<{ value: "L" | "M" | "Q" | "H"; label: string }> = [
  { value: "L", label: "Düşük" },
  { value: "M", label: "Orta" },
  { value: "Q", label: "Yüksek" },
  { value: "H", label: "Maksimum" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: QRSettings;
  onChange: (s: QRSettings) => void;
  inputText: string;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export default function CustomizeModal({ isOpen, onClose, settings, onChange, inputText, imageSettings }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const social = detectSocialPlatform(inputText);
  const qrValue = inputText.trim() || "Hoşgeldin topraaam";

  const set = useCallback(
    (patch: Partial<QRSettings>) => onChange({ ...settings, ...patch }),
    [settings, onChange]
  );

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        set({ customImage: e.target?.result as string, customImageName: file.name });
      };
      reader.readAsDataURL(file);
    },
    [set]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "overlayFadeIn 0.2s ease" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[820px] max-h-[85vh] flex flex-col overflow-hidden"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">QR Özelleştir</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Two-panel body */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-0">

          {/* Left: QR Preview (sticky) */}
          <div className="sm:w-[280px] shrink-0 flex flex-col items-center justify-center gap-5 p-6 bg-gray-50/60 border-b sm:border-b-0 sm:border-r border-gray-100">
            <div
              className="p-4 border border-gray-200/60 transition-all duration-300 shadow-sm"
              style={{
                borderRadius: `${settings.cornerRadius}px`,
                backgroundColor: settings.bgColor,
              }}
            >
              <QRCodeCanvas
                value={qrValue}
                size={180}
                level={settings.errorLevel}
                marginSize={settings.margin}
                bgColor={settings.bgColor}
                fgColor={settings.fgColor}
                imageSettings={imageSettings}
              />
            </div>
            <p className="text-[10px] text-gray-400 tracking-wide">
              {settings.size}×{settings.size} px
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              Tamam
            </button>
          </div>

          {/* Right: Scrollable settings */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-7 min-h-0">

            {/* ---- Social Media Icon ---- */}
            {social && (
              <Section title="Sosyal Medya İkonu">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className="text-gray-900">{social.icon}</span>
                    {social.name} algılandı
                  </div>
                  <Toggle
                    checked={settings.showSocialIcon}
                    onChange={(v) => set({ showSocialIcon: v })}
                  />
                </div>
              </Section>
            )}

            {/* ---- Custom Image Upload ---- */}
            <Section title="Özel Logo / Resim">
              {settings.customImage ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={settings.customImage}
                    alt="logo"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                  />
                  <span className="flex-1 text-sm text-gray-600 truncate">
                    {settings.customImageName}
                  </span>
                  <button
                    onClick={() => set({ customImage: null, customImageName: null })}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Sürükle bırak veya <span className="text-[var(--color-primary)] font-medium">dosya seç</span>
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, SVG</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </Section>

            {/* ---- Foreground Color ---- */}
            <Section title="QR Rengi">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.fgColor}
                  onChange={(e) => set({ fgColor: e.target.value })}
                />
                <div className="flex gap-1.5 flex-wrap">
                  {FG_PRESETS.map((c) => (
                    <button
                      key={c}
                      onClick={() => set({ fgColor: c })}
                      className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer hover:scale-110 ${settings.fgColor.toLowerCase() === c.toLowerCase() ? "border-[var(--color-primary)] scale-110" : "border-gray-200"
                        }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </Section>

            {/* ---- Background Color ---- */}
            <Section title="Arka Plan Rengi">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.bgColor}
                  onChange={(e) => set({ bgColor: e.target.value })}
                />
                <div className="flex gap-1.5 flex-wrap">
                  {BG_PRESETS.map((c) => (
                    <button
                      key={c}
                      onClick={() => set({ bgColor: c })}
                      className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer hover:scale-110 ${settings.bgColor.toLowerCase() === c.toLowerCase() ? "border-[var(--color-primary)] scale-110" : "border-gray-200"
                        }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </Section>

            {/* ---- Corner Radius ---- */}
            <Section title={`Köşe Yuvarlatması — ${settings.cornerRadius}px`}>
              <input
                type="range"
                min={0}
                max={32}
                value={settings.cornerRadius}
                onChange={(e) => set({ cornerRadius: Number(e.target.value) })}
              />
            </Section>

            {/* ---- Margin ---- */}
            <Section title={`Kenar Boşluğu — ${settings.margin}`}>
              <input
                type="range"
                min={0}
                max={6}
                value={settings.margin}
                onChange={(e) => set({ margin: Number(e.target.value) })}
              />
            </Section>

            {/* ---- Download Size ---- */}
            <Section title="İndirme Boyutu">
              <div className="flex gap-2">
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => set({ size: s })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${settings.size === s
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </Section>

            {/* ---- Error Level ---- */}
            <Section title="Hata Düzeltme">
              <div className="flex gap-2">
                {ERROR_LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    onClick={() => set({ errorLevel: lvl.value })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${settings.errorLevel === lvl.value
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </Section>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub‑components                                                     */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${checked ? "bg-[var(--color-primary)]" : "bg-gray-200"
        }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );
}
