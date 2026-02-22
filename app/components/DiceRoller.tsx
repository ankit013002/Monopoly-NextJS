"use client";

import { useState, useEffect, useRef } from "react";
import { PlayerType } from "../types/PlayerType";
import { roll2d6 } from "../utils/Movement";

// Pip layout for each die face (positions in a 3x3 grid: tl, tm, tr, ml, mm, mr, bl, bm, br)
const PIP_LAYOUTS: Record<number, boolean[]> = {
  1: [false, false, false, false, true, false, false, false, false],
  2: [false, false, true, false, false, false, true, false, false],
  3: [false, false, true, false, true, false, true, false, false],
  4: [true, false, true, false, false, false, true, false, true],
  5: [true, false, true, false, true, false, true, false, true],
  6: [true, false, true, true, false, true, true, false, true],
};

function DieFace({ value, rolling }: { value: number; rolling: boolean }) {
  const pips = PIP_LAYOUTS[value] ?? PIP_LAYOUTS[1];
  return (
    <div
      className={[
        "w-14 h-14 rounded-xl border-2 border-black/80 shadow-md",
        "grid grid-cols-3 grid-rows-3 p-1.5 gap-0.5",
        "transition-all duration-75",
        rolling ? "bg-white scale-95 opacity-80" : "bg-white scale-100",
      ].join(" ")}
    >
      {pips.map((active, i) => (
        <div key={i} className="flex items-center justify-center">
          {active && (
            <div className="w-2.5 h-2.5 rounded-full bg-black shadow-inner" />
          )}
        </div>
      ))}
    </div>
  );
}

interface DiceRollerProps {
  selectedToken: PlayerType | undefined;
  playerTurn: (socketId: string, steps: number) => Promise<null | undefined>;
  moveTokenSteps: (socketId: string, steps: number) => Promise<number>;
  lastRoll: { d1: number; d2: number; total: number } | null;
  setLastRoll: React.Dispatch<
    React.SetStateAction<{ d1: number; d2: number; total: number } | null>
  >;
  isMoving: boolean;
}

export default function DiceRoller({
  selectedToken,
  playerTurn,
  moveTokenSteps,
  lastRoll,
  setLastRoll,
  isMoving,
}: DiceRollerProps) {
  const [d1Display, setD1Display] = useState(1);
  const [d2Display, setD2Display] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rollDice = () => {
    if (!selectedToken || rolling || isMoving) return;

    const result = roll2d6();
    setRolling(true);
    setHasRolled(false);

    // Animate: rapidly cycle random faces
    intervalRef.current = setInterval(() => {
      setD1Display(1 + Math.floor(Math.random() * 6));
      setD2Display(1 + Math.floor(Math.random() * 6));
    }, 80);

    // After 900ms, stop and show result
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setD1Display(result.d1);
      setD2Display(result.d2);
      setLastRoll(result);
      setRolling(false);
      setHasRolled(true);
      void playerTurn(selectedToken.socketId, result.total);
    }, 900);
  };

  const moveAgain = () => {
    if (!selectedToken || !lastRoll || isMoving) return;
    void moveTokenSteps(selectedToken.socketId, lastRoll.total);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const disabled = !selectedToken || rolling || isMoving;

  return (
    <div className="mt-3 flex flex-col items-center gap-3">
      {/* Dice */}
      <button
        onClick={rollDice}
        disabled={disabled}
        className={[
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
          "border border-black/20",
          disabled
            ? "opacity-50 cursor-not-allowed bg-white/5"
            : "bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer shadow-md hover:shadow-lg",
        ].join(" ")}
        title="Click to roll dice"
      >
        <DieFace value={d1Display} rolling={rolling} />
        <div className="text-white/60 text-xs font-bold">+</div>
        <DieFace value={d2Display} rolling={rolling} />
      </button>

      {/* Roll summary + action */}
      <div className="flex items-center justify-between w-full gap-2">
        <div className="text-xs text-white/70">
          {rolling ? (
            <span className="animate-pulse">Rolling…</span>
          ) : lastRoll ? (
            <span>
              <span className="font-bold text-white">{lastRoll.d1}</span>
              {" + "}
              <span className="font-bold text-white">{lastRoll.d2}</span>
              {" = "}
              <span className="font-bold text-white text-sm">
                {lastRoll.total}
              </span>
            </span>
          ) : (
            <span className="opacity-50 italic">Click dice to roll</span>
          )}
        </div>

        {hasRolled && lastRoll && !rolling && !isMoving && (
          <button
            onClick={moveAgain}
            disabled={isMoving}
            className="text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 disabled:opacity-40"
          >
            Re-move
          </button>
        )}
      </div>
    </div>
  );
}
