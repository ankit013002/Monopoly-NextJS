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
  selectedId: number;
  onSelect: (id: number) => void;
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
            <div className="absolute inset-1 flex flex-wrap items-center justify-center gap-1">
              {list.map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(t.id);
                  }}
                  title={`${t.id} @ ${cell.space.name}`}
                  className={[
                    "pointer-events-auto",
                    "w-5 h-5 md:w-7 md:h-7",
                    "rounded-full border border-black/60 shadow-sm",
                    "flex items-center justify-center",
                    "text-[10px] md:text-xs font-bold text-white",
                    t.color,
                    selectedId === t.id ? "ring-2 ring-black/80" : "",
                  ].join(" ")}
                >
                  {t.id}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
