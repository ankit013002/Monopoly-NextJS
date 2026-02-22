"use client";

import { GameStateType } from "@/app/types/GameStateType";
import { PlayerType } from "@/app/types/PlayerType";
import { useEffect, useMemo } from "react";
import { FaCheck } from "react-icons/fa";

interface WaitingList {
  playerCount: number;
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  gameState: GameStateType;
}

const WaitingList = ({
  playerCount,
  socket,
  gameId,
  gameState,
}: WaitingList) => {
  const players = useMemo<
    Array<{ name: string; inGame: boolean } | undefined>
  >(() => {
    if (gameState && gameState.players) {
      const newPlayers: Array<{ name: string; inGame: boolean } | undefined> =
        gameState.players.map((player: PlayerType) => ({
          name: player.name,
          inGame: true,
        }));
      while (newPlayers.length < gameState.playerCount) {
        newPlayers.push(undefined);
      }
      return newPlayers;
    } else if (playerCount > 0) {
      // Initialize with empty slots when no gameState yet
      return Array.from({ length: playerCount }, () => undefined);
    }
    return [];
  }, [gameState, playerCount]);

  useEffect(() => {
    if (!socket) {
      console.log("WaitingList: No socket available");
      return;
    }

    console.log("WaitingList: Setting up game-state-update listener");

    const handleGameStateUpdate = (response: { gameState: GameStateType }) => {
      console.log(
        "WaitingList: Received game-state-update",
        response.gameState,
      );
      // Players will be updated via useMemo when gameState prop changes
    };

    socket.on("game-state-update", handleGameStateUpdate);

    return () => {
      socket.off("game-state-update", handleGameStateUpdate);
    };
  }, [socket]);

  const startGame = () => {
    if (!socket) {
      console.log("WaitingList: Cannot start game - no socket");
      return;
    }
    console.log("WaitingList: Starting game", gameId);
    socket.emit("start-game", { gameId });
  };

  const isHost = gameState?.players[0]?.socketId === socket?.id;
  const allPlayersJoined =
    players.length > 0 && players.every((p) => p?.inGame);

  return (
    <div className="flex flex-col gap-2">
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Game ID: {gameId}
        </li>

        {players.map((player, index) => {
          return (
            <li key={index} className="list-row items-center">
              <div className="text-4xl font-thin opacity-30 tabular-nums">
                {index + 1}
              </div>
              <div className="list-col-grow">
                <div>{player && player.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Waiting
                </div>
              </div>
              <div>
                {player && player.inGame ? (
                  <FaCheck />
                ) : (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <button
        disabled={!isHost || !allPlayersJoined}
        className="btn w-full bg-green-700"
        onClick={() => startGame()}
      >
        {!isHost
          ? "Waiting for host..."
          : !allPlayersJoined
            ? "Waiting for players..."
            : "Start Game"}
      </button>
    </div>
  );
};

export default WaitingList;
