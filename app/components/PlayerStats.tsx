import { useEffect } from "react";
import { PlayerType } from "../types/PlayerType";
import { BOARD_CELLS } from "../utils/BoardLayout";
import { AllPropertiesType } from "../types/SpaceType";
import { GROUP_STRIPE } from "../utils/Groups";

interface PlayerStatsProps {
  playerRef: PlayerType | null;
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  allProperties: AllPropertiesType;
}

const PlayerStats = ({
  playerRef,
  socket,
  allProperties,
}: PlayerStatsProps) => {
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

    const handlePingResponse = (response: {
      message: string;
      from: string;
    }) => {
      console.log("PlayerStats: Received ping response:", response);
      console.log(response.message, "from socket:", response.from);
    };

    socket.on("ping-health-response", handlePingResponse);

    return () => {
      socket.off("ping-health-response", handlePingResponse);
    };
  }, [socket, playerRef]);

  return (
    <div className="z-1000 rounded-xl border border-black/30 bg-black/80 shadow-md p-3 text-white">
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
                      className="flex items-center text-center gap-2 text-[11px] px-2 py-1 rounded hover:bg-white/10"
                    >
                      <div
                        className={`w-2 h-2 ${GROUP_STRIPE[space!.group!]}`}
                      />
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
        </>
      ) : (
        <div className="text-xs opacity-60">No player selected</div>
      )}
    </div>
  );
};

export default PlayerStats;
