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
    if (!playerRef || !socket) return;

    const handlePingResponse = (response: {
      message: string;
      from: string;
    }) => {
      console.log(response.message, "from socket:", response.from);
    };

    socket.on("ping-health-response", handlePingResponse);
    return () => {
      socket.off("ping-health-response", handlePingResponse);
    };
  }, [socket, playerRef]);

  if (!playerRef) return null;

  const positionName =
    BOARD_CELLS[playerRef.position]?.space?.name ?? "Unknown";

  const ownedWithData = playerRef.ownedSpaces.map((spaceId) => ({
    spaceId,
    space: Object.values(allProperties)
      .flat()
      .find((p) => p.id === spaceId),
  }));

  return (
    <div className="rounded-xl border border-white/15 bg-linear-to-b from-black/95 to-black/85 backdrop-blur-sm shadow-xl shadow-black/50 text-white overflow-hidden">
      {/* Colored header strip */}
      <div
        className="px-3 py-2.5 flex items-center gap-2.5 border-b"
        style={{ borderColor: `${playerRef.color}40` }}
      >
        <div
          className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-black/20"
          style={{
            backgroundColor: playerRef.color,
            boxShadow: `0 0 10px ${playerRef.color}80`,
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-white truncate">
            {playerRef.name}
          </div>
          <div className="text-[9px] text-white/35 uppercase tracking-wider">
            Stats
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="px-3 py-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/45">Balance</span>
          <span className="text-sm font-bold text-green-400">
            ${playerRef.balance.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-white/45 flex-shrink-0">
            Position
          </span>
          <span className="text-[11px] font-semibold text-white/80 text-right truncate">
            {positionName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/45">Properties</span>
          <span
            className={[
              "text-xs font-bold tabular-nums",
              ownedWithData.length > 0 ? "text-white" : "text-white/30",
            ].join(" ")}
          >
            {ownedWithData.length}
          </span>
        </div>
      </div>

      {/* Owned properties */}
      {ownedWithData.length > 0 ? (
        <div className="border-t border-white/10 px-3 py-2">
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1.5">
            Owned
          </div>
          <div className="max-h-28 overflow-y-auto flex flex-col gap-0.5 scrollbar-thin">
            {ownedWithData.map(({ spaceId, space }) => (
              <div
                key={spaceId}
                className="flex items-center gap-2 py-0.5 hover:bg-white/5 rounded px-1 -mx-1"
              >
                <div
                  className={`w-2 h-2 rounded-sm flex-shrink-0 ${GROUP_STRIPE[space!.group!]}`}
                />
                <span className="text-[11px] text-white/70 truncate">
                  {space?.name ?? `Space ${spaceId}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-t border-white/10 px-3 py-2.5">
          <span className="text-[10px] text-white/25 italic">
            No properties yet
          </span>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
