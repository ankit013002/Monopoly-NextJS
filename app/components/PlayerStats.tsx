import { useEffect } from "react";
import { PlayerType } from "../types/PlayerType";
import { BOARD_CELLS } from "../utils/BoardLayout";
import { AllPropertiesType } from "../types/SpaceType";

interface PlayerStatsProps {
  playerRef: PlayerType | null;
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  allProperties: AllPropertiesType;
}

const PlayerStats = ({
  playerRef,
  socket,
  gameId,
  allProperties,
}: PlayerStatsProps) => {
  console.log(playerRef, "PlayerStats: Received playerRef");

  useEffect(() => {
    if (!playerRef) {
      console.log("PlayerStats: No playerRef available");
      return;
    }

    if (!socket) {
      console.log("PlayerStats: No socket available");
      return;
    }

    console.log("PlayerStats: Setting up ping-health-response listener");

    const handlePingResponse = (response: any) => {
      console.log("PlayerStats: Received ping response:", response);
      console.log(response.message, "from socket:", response.from);
    };

    socket.on("ping-health-response", handlePingResponse);

    // Cleanup function
    return () => {
      socket.off("ping-health-response", handlePingResponse);
    };
  }, [socket, playerRef]);

  const endTurn = () => {
    if (!socket) {
      console.log("PlayerStats: Cannot end turn - no socket");
      return;
    }

    socket.emit("end-turn", {
      gameId,
    });
  };

  const pingServer = async () => {
    if (!socket) {
      console.log("PlayerStats: Cannot ping - no socket");
      return;
    }

    console.log("PlayerStats: Sending ping for game", gameId);
    socket.emit("ping-health", {
      gameId,
    });
  };

  console.log("Players ownsed spaces:", playerRef?.ownedSpaces);

  return (
    <div className="rounded-xl border border-black/30 bg-black/80 shadow-md p-3 text-white">
      {playerRef ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-sm">Player {playerRef.name}</div>
            <div
              className="h-3 w-3 rounded-full border border-black/40"
              style={{ backgroundColor: playerRef.color }}
            />
          </div>

          {/* Stats */}
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="opacity-80">Balance</span>
              <span className="font-semibold">
                ${playerRef.balance.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-80">Position</span>
              <span className="font-semibold">
                {playerRef.position} —{" "}
                {BOARD_CELLS[playerRef.position]?.space?.name ?? "Unknown"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-80">Properties</span>
              <span className="font-semibold">
                {playerRef.ownedSpaces.length}
              </span>
            </div>
          </div>

          {/* Owned properties list */}
          {playerRef?.ownedSpaces.length > 0 ? (
            <div className="mt-3">
              <div className="text-xs font-semibold mb-1">Owned Spaces</div>
              <div className="max-h-24 overflow-y-auto rounded-md border border-white/10 bg-white/5 p-1">
                {playerRef.ownedSpaces.map((spaceId) => {
                  const space = Object.values(allProperties)
                    .flat()
                    .find((p) => p.id === spaceId);
                  return (
                    <div
                      key={spaceId}
                      className="text-[11px] px-2 py-1 rounded hover:bg-white/10"
                    >
                      {space?.name ?? `Space ${spaceId}`}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs opacity-60 italic">
              No properties owned
            </div>
          )}
          <div className="flex flex-col p-3 gap-2">
            <button className="btn">Trade a Property</button>
            <button className="btn">Auction a Property</button>
            <button className="btn bg-red-700" onClick={() => endTurn()}>
              End Turn
            </button>
            <button onClick={() => pingServer()} className="btn bg-red-700">
              Ping Server
            </button>
          </div>
        </>
      ) : (
        <div className="text-xs opacity-60">No player selected</div>
      )}
    </div>
  );
};

export default PlayerStats;
