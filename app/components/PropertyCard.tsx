"use client";

import { Dispatch, SetStateAction } from "react";
import { GameStateType } from "../types/GameStateType";
import { PlayerType } from "../types/PlayerType";
import { SpaceType } from "../types/SpaceType";
import { GROUP_STRIPE } from "../utils/Groups";

interface PropertyCardPropsType {
  setGameState: Dispatch<SetStateAction<GameStateType>>;
  playerRef: PlayerType | undefined;
  property: SpaceType;
}

const PropertyCard = ({
  setGameState,
  playerRef,
  property,
}: PropertyCardPropsType) => {
  function purchaseProperty() {
    setGameState((prevState) => {
      if (!playerRef) return prevState;

      return {
        ...prevState,
        players: prevState.players.map((player) =>
          player.id === playerRef.id
            ? {
                ...player,
                ownedSpaces: player.ownedSpaces.includes(property.id)
                  ? player.ownedSpaces
                  : [...player.ownedSpaces, property.id],
              }
            : player,
        ),
        properties: prevState.properties.map((p) =>
          p.id === property.id ? { ...p, ownedBy: playerRef.id } : p,
        ),
      };
    });
  }

  console.log(property.ownedBy);

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
            {property.ownedBy == undefined ? (
              <button
                onClick={() => purchaseProperty()}
                className="btn flex justify-self-center bg-green-700/80 min-w-full border-green-700/90"
              >
                Buy Property
              </button>
            ) : (
              playerRef &&
              playerRef.id !== property.ownedBy && (
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
