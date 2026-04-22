"use client";

import { SetStateAction, useEffect, useMemo } from "react";
import { PlayerType } from "../types/PlayerType";
import { AllPropertiesType, SpaceType } from "../types/SpaceType";
import { GROUP_STRIPE } from "../utils/Groups";
import { Socket } from "socket.io-client";

interface PropertyCardPropsType {
  socket: Socket | null;
  gameId: number | null;
  allProperties: AllPropertiesType;
  playerRef: PlayerType | null;
  propertyId: number;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const PropertyCard = ({
  socket,
  gameId,
  allProperties,
  playerRef,
  propertyId,
  mustPayRent,
  setMustPayRent,
}: PropertyCardPropsType) => {
  const property = useMemo<SpaceType | null>(() => {
    if (!propertyId && !allProperties) {
      return null;
    }

    return (
      Object.values(allProperties)
        .flat()
        .find((prop) => prop.id === propertyId) ?? null
    );
  }, [allProperties, propertyId]);

  const landedOnPropertyAction = useMemo(() => {
    if (!property) return null;
    if (!playerRef) return null;
    if (property.ownedBy) {
      if (property.ownedBy.socketId === playerRef.socketId) {
        return "NOTHING";
      } else {
        return "PAY_RENT";
      }
    } else {
      return "BUY";
    }
  }, [property, playerRef]);

  useEffect(() => {
    if (landedOnPropertyAction === "PAY_RENT") setMustPayRent(true);
  }, [landedOnPropertyAction, propertyId, setMustPayRent]);

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

  function payRent() {
    if (!playerRef) {
      console.log("PropertyCard: No playerRef provided");
      return null;
    }

    if (!property || !property.price) {
      console.log("PropertyCard: No price defined for this property");
      return null;
    }

    if (!socket) {
      console.log("PropertyCard: No socket connection");
      return null;
    }

    setMustPayRent(false);

    socket.emit("pay-rent", {
      gameId,
      property,
    });
  }

  console.log(property?.ownedBy);

  return (
    <div className="absolute left-1 bottom-3 z-10">
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
            {landedOnPropertyAction === "BUY" ? (
              <button
                onClick={() => purchaseProperty()}
                className="w-full py-2 rounded-lg border border-green-600/50 bg-green-700/80 text-white text-sm font-bold hover:bg-green-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-green-900/30"
              >
                Buy — ${property.price}
              </button>
            ) : (
              landedOnPropertyAction === "PAY_RENT" &&
              mustPayRent && (
                <button
                  onClick={() => payRent()}
                  className="w-full py-2 rounded-lg border border-red-500/50 bg-red-700/80 text-white text-sm font-bold hover:bg-red-600/90 active:scale-95 transition-all duration-100 shadow-md shadow-red-900/30"
                >
                  Pay Rent — ${property.price}
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
