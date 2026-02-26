// app/components/BoardCenter.tsx
"use client";

import React from "react";

const BoardCenter = () => {
  return (
    <div
      className="relative border border-black/40 bg-[#f7f2e8]/80"
      style={{ gridColumn: "3 / span 9", gridRow: "3 / span 9" }}
    >
      <div className="absolute inset-0 p-4">
        <div className="h-full w-full border border-black/50 bg-white/40 flex items-center justify-center">
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="absolute inset-4 border border-black/40 bg-white/30" />
            <div className="absolute inset-8 border border-black/40 bg-white/20" />

            {/* Rotated MONOPOLY panel */}
            <div className="z-10 rotate-45 border-2 border-black/70 bg-white/80 px-6 py-4 shadow-md">
              <div className="text-center font-black text-black/40 tracking-[0.35em] text-xl md:text-3xl">
                MONOPOLY
              </div>
              <div className="mt-2 text-center text-[10px] md:text-xs text-black/40 font-semibold tracking-wide">
                (classic board layout)
              </div>
            </div>

            {/* Little center decorations */}
            <div className="absolute left-6 text-black/40 top-6 rotate-12 border border-black/40 bg-white/70 px-3 py-2 text-[10px] font-semibold">
              CHANCE
            </div>
            <div className="absolute text-black/40 right-6 bottom-6 -rotate-12 border border-black/40 bg-white/70 px-3 py-2 text-[10px] font-semibold">
              COMMUNITY CHEST
            </div>
            <div className="absolute text-black/40 right-6 top-6 -rotate-6 border border-black/40 bg-white/70 px-3 py-2 text-[10px] font-semibold">
              BANK
            </div>
            <div className="absolute text-black/40 left-6 bottom-6 rotate-6 border border-black/40 bg-white/70 px-3 py-2 text-[10px] font-semibold">
              DEEDS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCenter;
