"use client";

import { SetStateAction, useEffect, useMemo } from "react";
import { PlayerType } from "../types/PlayerType";
import { AllSpacesType, SpaceType } from "../types/SpaceType";
import { Socket } from "socket.io-client";

const RAILROAD_RENT = [25, 50, 100, 200];

interface RailroadCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  playerRef: PlayerType | null;
  railroadSpace: SpaceType;
  allSpaces: AllSpacesType;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const RailroadCard = ({
  socket,
  gameId,
  playerRef,
  railroadSpace: property,
  allSpaces,
  mustPayRent,
  setMustPayRent,
}: RailroadCardPropsType) => {
  const ownerRailroadCount = useMemo(() => {
    if (!property.ownedBy) return 0;
    return Object.values(allSpaces)
      .flat()
      .filter(
        (s) =>
          s.type === "railroad" &&
          s.ownedBy?.socketId === property.ownedBy!.socketId,
      ).length;
  }, [allSpaces, property.ownedBy]);

  const rentOwed = RAILROAD_RENT[ownerRailroadCount - 1] ?? 0;

  const isOwned = !!property.ownedBy;
  const isOwnedByPlayer = property.ownedBy?.socketId === playerRef?.socketId;

  const handlePurchase = () => {
    if (!playerRef || !property.price || !socket) return;
    if (playerRef.balance < property.price) {
      alert("You do not have enough funds to purchase this railroad.");
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
        <div className="h-[60px] flex items-center justify-center gap-2 bg-black border-b-2 border-black px-3">
          <span className="text-2xl">🚂</span>
          <span className="text-white font-bold text-sm uppercase text-center">
            {property.name}
          </span>
        </div>

        {/* Body */}
        <div className="p-3 text-sm text-black space-y-2">
          <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">
            Rent
          </div>
          <div className="space-y-1">
            {RAILROAD_RENT.map((rent, i) => (
              <div
                key={i}
                className={[
                  "flex justify-between px-2 py-1 rounded text-xs",
                  isOwned && ownerRailroadCount === i + 1
                    ? "bg-black text-white font-bold"
                    : "text-gray-600",
                ].join(" ")}
              >
                <span>
                  {i + 1} Railroad{i > 0 ? "s" : ""}
                </span>
                <span>${rent}</span>
              </div>
            ))}
          </div>

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
              ✓ You own this railroad
            </div>
          ) : mustPayRent ? (
            <button
              onClick={handlePayRent}
              className="w-full py-2 rounded-lg border border-red-600/50 bg-red-700/80 text-white text-sm font-bold hover:bg-red-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
            >
              Pay Rent — ${rentOwed}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RailroadCard;
