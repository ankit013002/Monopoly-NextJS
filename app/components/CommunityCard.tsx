"use client";

import { SetStateAction, useEffect } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

interface CommunityCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  communityChestSpace: SpaceType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const CommunityCard = ({
  socket,
  gameId,
  playerRef,
  communityChestSpace,
  mustPayRent,
  setMustPayRent,
}: CommunityCardPropsType) => {
  const handleDrawCard = () => {
    if (!playerRef || !socket) return;
    setMustPayRent(false);
    socket.emit("draw-community", { gameId });
  };

  useEffect(() => {
    setMustPayRent(true);
  }, [setMustPayRent]);

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center bg-amber-500 border-b-2 border-black">
          <span className="text-black font-bold text-sm uppercase tracking-widest px-2">
            {communityChestSpace.name}
          </span>
        </div>

        {/* Card illustration */}
        <div className="flex items-center justify-center py-5">
          <div className="w-20 h-28 bg-amber-500 border-2 border-black rounded-sm flex flex-col items-center justify-center gap-1 shadow-[2px_2px_0px_#000]">
            <span className="text-3xl">🎁</span>
            <span className="text-[10px] text-white font-bold uppercase tracking-wide text-center px-1">
              Community Chest
            </span>
          </div>
        </div>

        <div className="px-3 pb-3 space-y-3">
          <p className="text-xs text-gray-500 text-center">
            Take the top Community Chest card and follow its instructions.
          </p>

          <div className="h-px bg-black" />

          <button
            onClick={handleDrawCard}
            className="w-full py-2 rounded-lg border border-amber-600/50 bg-amber-600/80 text-white text-sm font-bold hover:bg-amber-500/90 active:scale-95 transition-all duration-100 shadow-md shadow-amber-900/30"
          >
            Draw Community Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
