"use client";

import { SetStateAction, useEffect, useMemo } from "react";
import { PlayerType } from "../types/PlayerType";
import { AllSpacesType, SpaceType } from "../types/SpaceType";
import { lastRollType } from "../types/lastRollType";
import { Socket } from "socket.io-client";

interface UtilityCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  utilitySpace: SpaceType;
  allSpaces: AllSpacesType;
  lastRoll: lastRollType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const UtilityCard = ({
  socket,
  gameId,
  playerRef,
  utilitySpace: property,
  allSpaces,
  lastRoll,
  mustPayRent,
  setMustPayRent,
}: UtilityCardPropsType) => {
  const ownerUtilityCount = useMemo(() => {
    if (!property.ownedBy) return 0;
    return Object.values(allSpaces)
      .flat()
      .filter(
        (s) =>
          s.type === "utility" &&
          s.ownedBy?.socketId === property.ownedBy!.socketId,
      ).length;
  }, [allSpaces, property.ownedBy]);

  const multiplier = ownerUtilityCount === 2 ? 10 : 4;
  const rentOwed = lastRoll ? multiplier * lastRoll.total : null;

  const isOwned = !!property.ownedBy;
  const isOwnedByPlayer = property.ownedBy?.socketId === playerRef?.socketId;

  const handlePurchase = () => {
    if (!playerRef || !property.price || !socket) return;
    if (playerRef.balance < property.price) {
      alert("You do not have enough funds to purchase this utility.");
      return;
    }
    socket.emit("purchase-property", { gameId, property });
  };

  const handlePayRent = () => {
    if (!playerRef || !socket) return;
    setMustPayRent(false);
    socket.emit("pay-rent", { gameId, property });
  };

  useEffect(() => {
    if (isOwned && !isOwnedByPlayer) setMustPayRent(true);
  }, [isOwned, isOwnedByPlayer, setMustPayRent]);

  return (
    <div className="absolute left-1 bottom-3 z-10">
      <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
        {/* Header */}
        <div className="h-[60px] flex items-center justify-center gap-2 bg-yellow-300 border-b-2 border-black px-3">
          <span className="text-2xl">{property.icon ?? "⚡"}</span>
          <span className="text-black font-bold text-sm uppercase text-center">
            {property.name}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 text-sm text-black space-y-2">
          <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">
            Rent
          </div>
          <div className="space-y-1">
            <div
              className={[
                "flex justify-between px-2 py-1 rounded text-xs",
                isOwned && ownerUtilityCount === 1
                  ? "bg-black text-white font-bold"
                  : "text-gray-600",
              ].join(" ")}
            >
              <span>1 Utility</span>
              <span>4× dice roll</span>
            </div>
            <div
              className={[
                "flex justify-between px-2 py-1 rounded text-xs",
                isOwned && ownerUtilityCount === 2
                  ? "bg-black text-white font-bold"
                  : "text-gray-600",
              ].join(" ")}
            >
              <span>2 Utilities</span>
              <span>10× dice roll</span>
            </div>
          </div>

          {isOwned && !isOwnedByPlayer && lastRoll && (
            <div className="bg-red-50 border border-red-200 rounded px-2 py-1.5 text-xs text-center">
              <span className="text-gray-600">
                {multiplier} × {lastRoll.total} ={" "}
              </span>
              <span className="font-bold text-red-600">${rentOwed}</span>
            </div>
          )}

          <div className="h-px bg-black" />

          <div className="flex justify-between text-sm">
            <span className="font-medium">Price</span>
            <span className="font-bold">${property.price}</span>
          </div>

          {isOwned && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: property.ownedBy!.color }}
              />
              <span>
                Owned by{" "}
                <span className="font-semibold">{property.ownedBy!.name}</span>
              </span>
            </div>
          )}

          <div className="h-px bg-black" />

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
            <button
              onClick={handlePayRent}
              className="w-full py-2 rounded-lg border border-red-600/50 bg-red-700/80 text-white text-sm font-bold hover:bg-red-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
            >
              Pay Rent{rentOwed !== null ? ` — $${rentOwed}` : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilityCard;
