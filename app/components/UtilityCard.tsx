"use client";

import { SetStateAction } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

interface UtilityCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  property: SpaceType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const UtilityCard = ({
  socket,
  gameId,
  playerRef,
  property,
  mustPayRent,
  setMustPayRent,
}: UtilityCardPropsType) => {
  const handlePurchase = () => {
    if (!playerRef || !property.price || !socket) {
      return;
    }

    if (playerRef.balance < property.price) {
      alert("You do not have enough funds to purchase this utility.");
      return;
    }

    socket.emit("purchase-property", {
      gameId,
      property,
    });
  };

  const handlePayRent = () => {
    if (!playerRef || !property.price || !socket) {
      return;
    }

    setMustPayRent(false);
    socket.emit("pay-rent", {
      gameId,
      property,
    });
  };

  const isOwned = !!property.ownedBy;
  const isOwnedByPlayer = property.ownedBy?.socketId === playerRef?.socketId;

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center bg-yellow-300 border-b-2 border-black">
          <span className="text-black font-bold text-sm uppercase text-center px-2">
            {property.name}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 text-sm text-black">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Type</span>
            <span>Utility</span>
          </div>

          <div className="h-px bg-black my-2" />

          <div className="text-center text-xs text-gray-700 mb-3">
            Pay rent based on dice roll
          </div>

          <div className="text-center text-base">
            Price: <span className="font-bold">${property.price}</span>
          </div>

          <div className="h-px bg-black my-2" />

          {!isOwned ? (
            <button
              onClick={handlePurchase}
              className="w-full py-2 rounded-lg border border-green-600/50 bg-green-700/80 text-white text-sm font-bold hover:bg-green-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-green-900/30"
            >
              Buy — ${property.price}
            </button>
          ) : isOwnedByPlayer ? (
            <div className="text-center text-sm font-semibold text-green-700 py-2">
              ✓ You own this utility
            </div>
          ) : (
            mustPayRent && (
              <button
                onClick={handlePayRent}
                className="w-full py-2 rounded-lg border border-red-600/50 bg-red-700/80 text-white text-sm font-bold hover:bg-red-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
              >
                Pay Rent
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilityCard;
