import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Color math
// ---------------------------------------------------------------------------

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Perceived luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111" : "#fff";
}

// ---------------------------------------------------------------------------
// Palette generation
// ---------------------------------------------------------------------------

interface Swatch {
  label: string;
  h: number;
  s: number;
  l: number;
}

function buildPalette(hue: number): Swatch[] {
  return [
    { label: "Base",        h: hue,                  s: 68, l: 56 },
    { label: "Light",       h: hue,                  s: 58, l: 76 },
    { label: "Dark",        h: hue,                  s: 64, l: 34 },
    { label: "Complement",  h: (hue + 180) % 360,    s: 68, l: 56 },
    { label: "Triadic A",   h: (hue + 120) % 360,    s: 62, l: 56 },
    { label: "Triadic B",   h: (hue + 240) % 360,    s: 62, l: 56 },
  ];
}

const RAINBOW_GRADIENT = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, i) => `hsl(${(i / 12) * 360}, 68%, 56%)`,
).join(", ")})`;

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function SwatchCard({
  swatch,
  isCopied,
  onCopy,
}: {
  swatch: Swatch;
  isCopied: boolean;
  onCopy: (hex: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const hex = hslToHex(swatch.h, swatch.s, swatch.l);
  const fg = contrastColor(hex);

  return (
    <button
      onClick={() => onCopy(hex)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Click to copy ${hex}`}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        borderRadius: 14,
        overflow: "hidden",
        transform: hovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.45)" : "0 2px 8px rgba(0,0,0,0.25)",
        textAlign: "left",
      }}
    >
      {/* Color block */}
      <div
        style={{
          background: hex,
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          transition: "opacity 0.15s",
        }}
      >
        {isCopied && (
          <span style={{ color: fg, fontWeight: 700, fontSize: 15 }}>✓ Copied</span>
        )}
      </div>

      {/* Label row */}
      <div
        style={{
          background: "#1c1c26",
          padding: "9px 13px 10px",
        }}
      >
        <div style={{ fontSize: 10, color: "#777", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {swatch.label}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "monospace", color: "#ddd" }}>
          {hex}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

export default function App() {
  const [hue, setHue] = useState(217);
  const [copied, setCopied] = useState<string | null>(null);

  const palette = buildPalette(hue);
  const baseHex = hslToHex(hue, 68, 56);

  const handleCopy = useCallback((hex: string) => {
    // Try Clipboard API first, fall back to execCommand
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex).catch(() => {});
    } else {
      const el = document.createElement("textarea");
      el.value = hex;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(hex);
    setTimeout(() => setCopied(null), 1600);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111118",
        color: "#e8e8f0",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 64px",
        boxSizing: "border-box",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: baseHex,
            borderRadius: 14,
            margin: "0 auto 16px",
            transition: "background 0.2s",
          }}
        />
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Color Palette Generator
        </h1>
        <p style={{ color: "#666", marginTop: 8, fontSize: 14, margin: "8px 0 0" }}>
          Drag the slider · click any swatch to copy its hex code
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Hue slider                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#1c1c26",
          borderRadius: 18,
          padding: "22px 24px 20px",
          boxSizing: "border-box",
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 12, color: "#777", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Base Hue
          </span>
          <span
            style={{
              background: baseHex,
              color: contrastColor(baseHex),
              padding: "3px 12px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "monospace",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            {hue}°
          </span>
        </div>

        {/* Rainbow track (decorative) */}
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: RAINBOW_GRADIENT,
            marginBottom: 6,
            pointerEvents: "none",
          }}
        />

        <input
          type="range"
          min={0}
          max={359}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: baseHex,
            cursor: "pointer",
            marginTop: 2,
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Palette grid                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          width: "100%",
          maxWidth: 460,
        }}
      >
        {palette.map((swatch) => (
          <SwatchCard
            key={swatch.label}
            swatch={swatch}
            isCopied={copied === hslToHex(swatch.h, swatch.s, swatch.l)}
            onCopy={handleCopy}
          />
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}
      <p style={{ color: "#444", fontSize: 12, marginTop: 40 }}>
        Previewed with{" "}
        <a href="https://pacyhub.com" style={{ color: "#666", textDecoration: "none" }}>
          PacyHub
        </a>
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Copy toast                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: `translateX(-50%) translateY(${copied ? 0 : 12}px)`,
          opacity: copied ? 1 : 0,
          background: "#fff",
          color: "#111",
          padding: "10px 22px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          pointerEvents: "none",
          transition: "opacity 0.2s, transform 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        Copied {copied}
      </div>
    </div>
  );
}
