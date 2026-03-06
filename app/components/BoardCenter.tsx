// app/components/BoardCenter.tsx
"use client";

import React from "react";

// Property color groups for the legend strip
const COLOR_GROUPS = [
  { color: "#7a4a21", label: "Brown" },
  { color: "#9ad5ff", label: "Lt. Blue" },
  { color: "#ff7ab6", label: "Pink" },
  { color: "#ff9a2f", label: "Orange" },
  { color: "#ff3b3b", label: "Red" },
  { color: "#ffe14a", label: "Yellow" },
  { color: "#2ccf6f", label: "Green" },
  { color: "#2258ff", label: "Dk. Blue" },
];

const BoardCenter = () => {
  return (
    <div
      style={{
        gridColumn: "3 / span 9",
        gridRow: "3 / span 9",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #faf7f0 0%, #f5edd8 50%, #ede0c4 100%)",
        border: "1px solid rgba(0,0,0,0.65)",
      }}
    >
      {/* Outer border frame */}
      <div
        style={{
          position: "absolute",
          inset: "8px",
          border: "1.5px solid rgba(0,0,0,0.20)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Inner border frame */}
      <div
        style={{
          position: "absolute",
          inset: "12px",
          border: "0.75px solid rgba(0,0,0,0.10)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Subtle diagonal watermark lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.04,
          pointerEvents: "none",
        }}
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={i * 20 - 100}
            y1="0"
            x2={i * 20 + 100}
            y2="200"
            stroke="#3a2000"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* Main center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          gap: "6px",
          zIndex: 2,
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(5px, 1vw, 10px)",
            fontWeight: 700,
            letterSpacing: "0.45em",
            color: "rgba(60,35,5,0.45)",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          The World&apos;s Greatest
        </div>

        {/* Thin rule */}
        <div
          style={{
            width: "55%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(60,35,5,0.25), transparent)",
          }}
        />

        {/* MONOPOLY logotype */}
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Shadow layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontSize: "clamp(14px, 4.2vw, 44px)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "rgba(0,0,0,0.18)",
              transform: "translate(2px, 3px)",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            MONOPOLY
          </div>

          {/* Main text */}
          <div
            style={{
              fontFamily: "'Arial Black', 'Arial', sans-serif",
              fontSize: "clamp(14px, 4.2vw, 44px)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#1a1a1a",
              userSelect: "none",
              whiteSpace: "nowrap",
              position: "relative",
            }}
          >
            MONOPOLY
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(4px, 0.85vw, 9px)",
            fontWeight: 700,
            letterSpacing: "0.4em",
            color: "rgba(60,35,5,0.40)",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Board Game
        </div>

        {/* Thick rule */}
        <div
          style={{
            width: "60%",
            height: "1.5px",
            background: "linear-gradient(90deg, transparent, rgba(60,35,5,0.30), transparent)",
            margin: "2px 0",
          }}
        />

        {/* Color group legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(2px, 0.5vw, 6px)",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {COLOR_GROUPS.map((g) => (
            <div
              key={g.label}
              style={{
                width: "clamp(8px, 1.5vw, 16px)",
                height: "clamp(8px, 1.5vw, 16px)",
                borderRadius: "3px",
                backgroundColor: g.color,
                boxShadow: "0 1px 2px rgba(0,0,0,0.20)",
                border: "1px solid rgba(0,0,0,0.15)",
                flexShrink: 0,
                title: g.label,
              }}
              title={g.label}
            />
          ))}
        </div>

        {/* Bank / Deeds row */}
        <div
          style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 20px)",
            marginTop: "4px",
          }}
        >
          {["BANK", "DEEDS", "HOUSES"].map((label) => (
            <div
              key={label}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(4px, 0.7vw, 7px)",
                fontWeight: 700,
                letterSpacing: "0.25em",
                color: "rgba(60,35,5,0.30)",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Corner flourishes */}
      {(
        [
          { top: "18px", left: "18px", bottom: undefined, right: undefined, rotate: "0deg" },
          { top: "18px", right: "18px", bottom: undefined, left: undefined, rotate: "90deg" },
          { bottom: "18px", left: "18px", top: undefined, right: undefined, rotate: "-90deg" },
          { bottom: "18px", right: "18px", top: undefined, left: undefined, rotate: "180deg" },
        ] as Array<{ top?: string; bottom?: string; left?: string; right?: string; rotate: string }>
      ).map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "16px",
            height: "16px",
            pointerEvents: "none",
            zIndex: 3,
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
            transform: `rotate(${pos.rotate})`,
          }}
        >
          <svg viewBox="0 0 16 16" style={{ width: "100%", height: "100%", opacity: 0.22 }}>
            <path d="M0,16 L0,2 Q0,0 2,0 L16,0" fill="none" stroke="#3a2000" strokeWidth="1.5" />
            <circle cx="2" cy="2" r="1.2" fill="#3a2000" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default BoardCenter;
