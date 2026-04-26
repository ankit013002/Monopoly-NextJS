import React, { SetStateAction, useMemo } from "react";
import { AllPropertiesType, SpaceType } from "../types/SpaceType";
import PropertyCard from "./PropertyCard";
import RailroadCard from "./RailroadCard";
import UtilityCard from "./UtilityCard";
import TaxCard from "./TaxCard";
import ChanceCard from "./ChanceCard";
import CommunityCard from "./CommunityCard";
import { PlayerType } from "../types/PlayerType";
import { Socket } from "socket.io-client";

interface SpaceHandlerProps {
  socket: Socket | null;
  gameId: number | null;
  allSpaces: AllPropertiesType;
  playerRef: PlayerType | null;
  spaceId: number;
  mustPayRent: boolean;
  setMustPayRent: React.Dispatch<SetStateAction<boolean>>;
}

const SpaceHandler = ({
  socket,
  gameId,
  allSpaces,
  playerRef,
  spaceId,
  mustPayRent,
  setMustPayRent,
}: SpaceHandlerProps) => {
  const space = useMemo<SpaceType | null>(() => {
    if (!spaceId && !allSpaces) {
      return null;
    }

    return (
      Object.values(allSpaces)
        .flat()
        .find((prop) => prop.id === spaceId) ?? null
    );
  }, [allSpaces, spaceId]);

  switch (space?.type) {
    case "property":
      return (
        <PropertyCard
          socket={socket}
          gameId={gameId}
          playerRef={playerRef}
          property={space}
          mustPayRent={mustPayRent}
          setMustPayRent={setMustPayRent}
        />
      );
    case "railroad":
      return (
        <RailroadCard
          socket={socket}
          gameId={gameId}
          playerRef={playerRef}
          property={space}
          mustPayRent={mustPayRent}
          setMustPayRent={setMustPayRent}
        />
      );
    case "utility":
      return (
        <UtilityCard
          socket={socket}
          gameId={gameId}
          playerRef={playerRef}
          property={space}
          mustPayRent={mustPayRent}
          setMustPayRent={setMustPayRent}
        />
      );
    case "tax":
      return (
        <TaxCard
          socket={socket}
          gameId={gameId}
          playerRef={playerRef}
          property={space}
          mustPayRent={mustPayRent}
          setMustPayRent={setMustPayRent}
        />
      );
    case "chance":
      return (
        <ChanceCard
          socket={socket}
          gameId={gameId}
          playerRef={playerRef}
          property={space}
          mustPayRent={mustPayRent}
          setMustPayRent={setMustPayRent}
        />
      );
    case "community":
      return (
        <CommunityCard
          socket={socket}
          gameId={gameId}
          playerRef={playerRef}
          property={space}
          mustPayRent={mustPayRent}
          setMustPayRent={setMustPayRent}
        />
      );
    default:
      return null;
  }
};

export default SpaceHandler;
