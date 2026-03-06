import { Dispatch, SetStateAction } from "react";
import { lastRollType } from "../types/lastRollType";

interface EndTurnButtonProps {
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  lastRoll: lastRollType;
  mustPayRent: boolean;
  setLastRoll: Dispatch<SetStateAction<lastRollType>>;
}

const EndTurnButton = ({
  socket,
  gameId,
  lastRoll,
  mustPayRent,
  setLastRoll,
}: EndTurnButtonProps) => {
  const endTurn = () => {
    if (!socket) {
      console.log("PlayerStats: Cannot end turn - no socket");
      return;
    }
    setLastRoll(null);

    socket.emit("end-turn", {
      gameId,
    });
  };

  const disabled = mustPayRent || !lastRoll;

  return (
    <button
      disabled={disabled}
      onClick={() => endTurn()}
      className={[
        "px-5 py-2.5 rounded-xl border text-sm font-bold transition-all duration-150",
        "backdrop-blur-sm shadow-lg",
        disabled
          ? "bg-black/60 border-white/10 text-white/25 cursor-not-allowed"
          : "bg-red-600/80 border-red-500/40 text-white hover:bg-red-500/90 active:scale-95 cursor-pointer shadow-red-900/50",
      ].join(" ")}
    >
      End Turn
    </button>
  );
};

export default EndTurnButton;
