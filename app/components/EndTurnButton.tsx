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

  return (
    <button
      disabled={mustPayRent || !lastRoll}
      className="btn bg-red-700"
      onClick={() => endTurn()}
    >
      End Turn
    </button>
  );
};

export default EndTurnButton;
