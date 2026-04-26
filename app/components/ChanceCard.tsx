"use client";

import { SetStateAction, useEffect } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

interface ChanceCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  chanceSpace: SpaceType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const ChanceCard = ({
  socket,
  gameId,
  playerRef,
  chanceSpace: property,
  mustPayRent,
  setMustPayRent,
}: ChanceCardPropsType) => {
  const handleDrawCard = () => {
    if (!playerRef || !socket) return;
    setMustPayRent(false);
    socket.emit("draw-chance", { gameId });
  };

  useEffect(() => {
    setMustPayRent(true);
  }, [setMustPayRent]);

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center bg-orange-400 border-b-2 border-black">
          <span className="text-black font-bold text-sm uppercase tracking-widest px-2">
            {property.name}
          </span>
        </div>

        {/* Card illustration */}
        <div className="flex items-center justify-center py-5">
          <div className="w-20 h-28 bg-orange-400 border-2 border-black rounded-sm flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <span className="text-5xl font-bold text-white">?</span>
          </div>
        </div>

        <div className="px-3 pb-3 space-y-3">
          <p className="text-xs text-gray-500 text-center">
            Take the top Chance card and follow its instructions.
          </p>

          <div className="h-px bg-black" />

          <button
            onClick={handleDrawCard}
            className="w-full py-2 rounded-lg border border-orange-600/50 bg-orange-500/80 text-white text-sm font-bold hover:bg-orange-400/90 active:scale-95 transition-all duration-100 shadow-md shadow-orange-900/30"
          >
            Draw Chance Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChanceCard;
