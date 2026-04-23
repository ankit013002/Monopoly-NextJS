"use client";

import { useState, useEffect, useRef } from "react";
import { PlayerType } from "../types/PlayerType";
import { roll2d6 } from "../utils/Movement";
import { lastRollType } from "../types/lastRollType";
import { Socket } from "socket.io-client";

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
  lastRoll: lastRollType;
  setLastRoll: React.Dispatch<React.SetStateAction<lastRollType>>;
  isMoving: boolean;
  socket: Socket | null;
  gameId: number | null;
}

export default function DiceRoller({
  selectedToken,
  playerTurn,
  lastRoll,
  setLastRoll,
  isMoving,
  socket,
  gameId,
}: DiceRollerProps) {
  const [d1Display, setD1Display] = useState(1);
  const [d2Display, setD2Display] = useState(1);
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rollDice = () => {
    if (!selectedToken || rolling || isMoving) return;

    const result = roll2d6();
    setRolling(true);

    // Animate: rapidly cycle random faces
    intervalRef.current = setInterval(() => {
      setD1Display(1 + Math.floor(Math.random() * 6));
      setD2Display(1 + Math.floor(Math.random() * 6));
    }, 80);

    socket?.emit("dice-roll", {
      gameId: gameId,
      diceRoll: result,
    });

    // After 900ms, stop and show result
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setD1Display(result.d1);
      setD2Display(result.d2);
      setLastRoll(result);
      setRolling(false);

      void playerTurn(selectedToken.socketId, result.total);
    }, 900);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const disabled = !selectedToken || rolling || isMoving || lastRoll != null;

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
      </div>

      {process.env.NODE_ENV !== "production" && (
        <div className="flex gap-1.5 w-full">
          {[1, 3, 6, 10].map((steps) => (
            <button
              key={steps}
              onClick={() => {
                if (!selectedToken || rolling || isMoving || lastRoll != null)
                  return;
                const fakeRoll = { d1: steps, d2: 0, total: steps };
                socket?.emit("dice-roll", { gameId, diceRoll: fakeRoll });
                setLastRoll(fakeRoll);
                void playerTurn(selectedToken.socketId, steps);
              }}
              disabled={disabled}
              className={[
                "flex-1 py-1 rounded text-xs font-bold transition-all border border-yellow-400/30",
                disabled
                  ? "opacity-30 cursor-not-allowed bg-yellow-400/5 text-yellow-400/40"
                  : "bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 active:scale-95 cursor-pointer",
              ].join(" ")}
            >
              +{steps}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
