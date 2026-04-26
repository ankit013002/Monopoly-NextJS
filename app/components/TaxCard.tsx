"use client";

import { SetStateAction } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

interface TaxCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  property: SpaceType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const TaxCard = ({
  socket,
  gameId,
  playerRef,
  property,
  mustPayRent,
  setMustPayRent,
}: TaxCardPropsType) => {
  const taxAmount = property.price || 200; // Default tax amount

  const handlePayTax = () => {
    if (!playerRef || !socket) {
      return;
    }

    if (playerRef.balance < taxAmount) {
      alert("You do not have enough funds to pay this tax.");
      return;
    }

    setMustPayRent(false);
    socket.emit("pay-tax", {
      gameId,
      amount: taxAmount,
    });
  };

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center bg-red-400 border-b-2 border-black">
          <span className="text-black font-bold text-sm uppercase text-center px-2">
            {property.name}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 text-sm text-black">
          <div className="text-center text-lg font-bold text-red-600 mb-2">
            PAY TAX
          </div>

          <div className="h-px bg-black my-2" />

          <div className="text-center text-base">
            Tax Amount: <span className="font-bold">${taxAmount}</span>
          </div>

          <div className="h-px bg-black my-2" />

          {mustPayRent ? (
            <button
              onClick={handlePayTax}
              className="w-full py-2 rounded-lg border border-red-600/50 bg-red-700/80 text-white text-sm font-bold hover:bg-red-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
            >
              Pay Tax — ${taxAmount}
            </button>
          ) : (
            <div className="text-center text-sm font-semibold text-gray-600 py-2">
              Tax paid
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxCard;
