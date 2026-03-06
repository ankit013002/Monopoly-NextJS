// app/components/TokensLayer.tsx
"use client";

import React, { useMemo } from "react";
import type { BoardCell } from "../utils/BoardLayout";
import { PlayerType } from "../types/PlayerType";

export default function TokensLayer({
  tokens,
  board,
  selectedId,
  onSelect,
}: {
  tokens: PlayerType[];
  board: BoardCell[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const tokensByPos = useMemo(() => {
    const map = new Map<number, PlayerType[]>();
    for (const t of tokens) {
      const list = map.get(t.position) ?? [];
      list.push(t);
      map.set(t.position, list);
    }
    return map;
  }, [tokens]);

  return (
    <>
      {board.map((cell) => {
        const list = tokensByPos.get(cell.pos) ?? [];
        if (list.length === 0) return null;

        return (
          <div
            key={`tokpos-${cell.pos}`}
            className="pointer-events-none relative z-30"
            style={{
              gridColumn: `${cell.gridColumn} / span ${cell.colSpan}`,
              gridRow: `${cell.gridRow} / span ${cell.rowSpan}`,
            }}
          >
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-0.5">
              {list.map((t) => {
                const isSelected = selectedId === t.socketId;
                const initial = t.name.charAt(0).toUpperCase();
                return (
                  <button
                    key={t.socketId}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(t.socketId);
                    }}
                    title={`${t.name} @ ${cell.space.name}`}
                    className={[
                      "pointer-events-auto",
                      "w-5 h-5 md:w-6 md:h-6",
                      "rounded-full",
                      `bg-${t.color}`,
                      "flex items-center justify-center",
                      "text-[8px] md:text-[9px] font-black text-white",
                      "transition-all duration-150",
                      "select-none",
                    ].join(" ")}
                    style={{
                      border: isSelected
                        ? `2px solid white`
                        : `1.5px solid rgba(0,0,0,0.5)`,
                      boxShadow: isSelected
                        ? `0 0 0 2px ${t.color}, 0 0 8px ${t.color}cc, 0 2px 4px rgba(0,0,0,0.4)`
                        : `0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)`,
                      transform: isSelected ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    {initial}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
