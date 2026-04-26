"use client";

import { SetStateAction, useEffect } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

interface TaxCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  taxSpace: SpaceType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const TaxCard = ({
  socket,
  gameId,
  playerRef,
  taxSpace: property,
  mustPayRent,
  setMustPayRent,
}: TaxCardPropsType) => {
  const taxAmount = property.price ?? 200;
  const isLuxury = property.name.toLowerCase().includes("luxury");

  const handlePayTax = () => {
    if (!playerRef || !socket) return;
    if (playerRef.balance < taxAmount) {
      alert("You do not have enough funds to pay this tax.");
      return;
    }
    setMustPayRent(false);
    socket.emit("pay-tax", { gameId, amount: taxAmount });
  };

  useEffect(() => {
    setMustPayRent(true);
  }, [setMustPayRent]);

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center gap-2 bg-red-400 border-b-2 border-black px-3">
          <span className="text-2xl">{property.icon ?? "💰"}</span>
          <span className="text-black font-bold text-sm uppercase text-center">
            {property.name}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 text-sm text-black space-y-3">
          <p className="text-xs text-gray-600 text-center">
            {isLuxury
              ? "A luxury tax must be paid to the bank."
              : "Income tax must be paid to the bank."}
          </p>

          <div className="h-px bg-black" />

          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
              Tax Amount
            </div>
            <div className="text-2xl font-bold text-red-600">${taxAmount}</div>
          </div>

          <div className="h-px bg-black" />

          <button
            onClick={handlePayTax}
            className="w-full py-2 rounded-lg border border-red-600/50 bg-red-700/80 text-white text-sm font-bold hover:bg-red-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
          >
            Pay ${taxAmount} to Bank
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxCard;
