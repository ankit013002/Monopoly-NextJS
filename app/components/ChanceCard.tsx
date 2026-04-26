"use client";

import { SetStateAction } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

interface ChanceCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  property: SpaceType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const ChanceCard = ({
  socket,
  gameId,
  playerRef,
  property,
  mustPayRent,
  setMustPayRent,
}: ChanceCardPropsType) => {
  const handleDrawCard = () => {
    if (!playerRef || !socket) {
      return;
    }

    setMustPayRent(false);
    socket.emit("draw-chance", {
      gameId,
    });
  };

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center bg-red-500 border-b-2 border-black">
          <span className="text-white font-bold text-sm uppercase text-center px-2">
            {property.name}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 text-sm text-black">
          <div className="text-center text-lg font-bold text-red-600 mb-2">
            CHANCE CARD
          </div>

          <div className="h-px bg-black my-2" />

          <div className="text-center text-xs text-gray-700 mb-3">
            Draw a chance card and follow the instructions
          </div>

          <div className="h-px bg-black my-2" />

          <button
            onClick={handleDrawCard}
            className="w-full py-2 rounded-lg border border-red-600/50 bg-red-600/80 text-white text-sm font-bold hover:bg-red-500/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
          >
            Draw Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChanceCard;
