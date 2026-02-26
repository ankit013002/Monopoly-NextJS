"use client";

import { GameStateType } from "../types/GameStateType";

interface PlayerListProps {
  gameState: GameStateType;
}

export default function PlayerList({ gameState }: PlayerListProps) {
  return (
    <div className="z-1000 rounded-xl border border-black/30 bg-black/80 shadow-md p-3">
      <div className="font-bold text-sm mb-2">Players</div>
      <div className="flex flex-col gap-2">
        {gameState.players.map((player, index) => {
          const isSelected = index === gameState.playerTurnIndex;
          console.log("Player: ", player);

          return (
            <div
              key={player.socketId}
              className={[
                "flex items-center justify-between rounded-md border px-3 py-2 text-xs",
                "transition-colors",
                isSelected
                  ? "bg-white/40 border-white/80"
                  : "bg-white/5 border-white/20",
              ].join(" ")}
            >
              {/* Left: color + ID */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full border border-black/40 bg-${player.color}`}
                />
                <span className="font-semibold">{player.name}</span>
              </div>

              {/* Right: stats */}
              <div className="text-right leading-tight">
                <div className="font-semibold">
                  {/*${player.balance.toLocaleString()} */}
                </div>
                <div className="opacity-80">
                  Pos {player.position} • {player.ownedSpaces.length} props
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
