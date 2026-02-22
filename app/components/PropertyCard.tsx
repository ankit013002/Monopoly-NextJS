"use client";

import { useMemo, useState } from "react";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { GROUP_STRIPE } from "../utils/Groups";

interface PropertyCardPropsType {
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  allProperties: SpaceType[];
  playerRef: PlayerType | null;
  propertyId: number;
}

const PropertyCard = ({
  socket,
  gameId,
  allProperties,
  playerRef,
  propertyId,
}: PropertyCardPropsType) => {
  const property = useMemo<SpaceType | null>(() => {
    if (!propertyId && !allProperties) {
      return null;
    }

    return allProperties.find((prop) => prop.id === propertyId) ?? null;
  }, [allProperties, propertyId]);

  function purchaseProperty() {
    if (!playerRef) {
      console.log("PropertyCard: No playerRef provided");
      return null;
    }

    if (!property || !property.price) {
      console.log("PropertyCard: No price defined for this property");
      return null;
    }

    if (playerRef.balance < property.price) {
      alert("You do not have enough funds to purchase this property.");
      return;
    }

    if (!socket) {
      console.log("PropertyCard: No socket connection");
      return null;
    }

    console.log(
      "CAN PURCHASE PROPERTY:",
      property.name,
      "for player",
      playerRef.name,
    );

    socket.emit("purchase-property", {
      gameId,
      property,
    });
  }

  console.log(property?.ownedBy);

  return (
    <div className="absolute right-1 bottom-3 z-900">
      {property?.type === "property" ? (
        <div className="w-[260px] bg-[#fdfcf7] border-2 border-black shadow-[3px_3px_0px_#000] font-sans">
          {/* Color band */}
          <div
            className={[
              "h-[60px] flex items-center justify-center border-b-2 border-black",
              GROUP_STRIPE[property.group!] ?? "bg-gray-700",
            ].join(" ")}
          >
            <span className="text-black font-bold text-sm uppercase text-center px-2">
              {property.name}
            </span>
          </div>

          {/* Body */}
          <div className="p-3 text-sm text-black">
            <div className="flex justify-between mb-1">
              <span className="font-medium">Type</span>
              <span>Street</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="font-medium">Color</span>
              <span className="capitalize">{property.group}</span>
            </div>

            <div className="h-px bg-black my-2" />

            <div className="text-center text-base">
              Price: <span className="font-bold">{property.price}</span>
            </div>

            <div className="h-px bg-black my-2" />
            {property?.ownedBy == undefined ? (
              <button
                onClick={() => purchaseProperty()}
                className="btn flex justify-self-center bg-green-700/80 min-w-full border-green-700/90"
              >
                Buy Property
              </button>
            ) : (
              playerRef &&
              playerRef.socketId !== property.ownedBy && (
                <button className="btn flex justify-self-center bg-red-700/80 min-w-full border-red-700/90">
                  Pay Rent
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="w-[260px] text-center text-xs opacity-60">
          No property selected
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
