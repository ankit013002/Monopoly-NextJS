"use client";

import { GameStateType } from "../types/GameStateType";
import { PlayerType } from "../types/PlayerType";

interface PlayerListProps {
  selectedPlayerToView: PlayerType | null;
  setPlayerToView: React.Dispatch<React.SetStateAction<PlayerType | null>>;
  gameState: GameStateType;
}

export default function PlayerList({
  selectedPlayerToView,
  setPlayerToView,
  gameState,
}: PlayerListProps) {
  const currentTurnPlayer = gameState.players[gameState.playerTurnIndex];

  return (
    <div className="rounded-xl border border-white/15 bg-linear-to-b from-black/95 to-black/85 backdrop-blur-sm shadow-xl shadow-black/50 text-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
        <div className="w-1 h-3 rounded-full bg-yellow-400" />
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
          Players
        </span>
      </div>

      {/* Player rows */}
      <div className="p-1.5 flex flex-col gap-0.5">
        {gameState.players.map((player) => {
          const isSelected = player.socketId === selectedPlayerToView?.socketId;
          const isCurrentTurn =
            player.socketId === currentTurnPlayer?.socketId;

          return (
            <button
              key={player.socketId}
              onClick={() => setPlayerToView(player)}
              className={[
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left",
                "transition-all duration-150 cursor-pointer",
                isSelected
                  ? "bg-white/20 ring-1 ring-white/30"
                  : isCurrentTurn
                    ? "bg-yellow-400/10 ring-1 ring-yellow-400/25 hover:bg-yellow-400/15"
                    : "hover:bg-white/10",
              ].join(" ")}
            >
              {/* Token color circle */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 border border-black/20 shadow-sm"
                style={{
                  backgroundColor: player.color,
                  boxShadow: isCurrentTurn
                    ? `0 0 6px ${player.color}99`
                    : undefined,
                }}
              />

              {/* Name */}
              <span
                className={[
                  "text-xs font-semibold truncate flex-1 min-w-0",
                  isCurrentTurn ? "text-yellow-300" : "text-white/90",
                ].join(" ")}
              >
                {player.name}
              </span>

              {/* Balance */}
              <span className="text-[10px] font-mono text-green-400/80 flex-shrink-0">
                ${player.balance.toLocaleString()}
              </span>

              {/* Turn badge */}
              {isCurrentTurn && (
                <span className="flex-shrink-0 text-[8px] font-bold text-yellow-900 bg-yellow-400 rounded px-1 py-0.5 leading-tight">
                  GO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
