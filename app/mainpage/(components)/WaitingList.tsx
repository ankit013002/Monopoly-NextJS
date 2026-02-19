"use client";

import { GameStateType } from "@/app/types/GameStateType";
import { redirect } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

interface WaitingList {
  playerName: string;
  playerCount: number;
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  gameState: GameStateType;
}

const WaitingList = ({
  playerName,
  playerCount,
  socket,
  gameId,
  gameState,
}: WaitingList) => {
  const [players, setPlayers] = useState<
    Array<{ name: string; inGame: boolean } | undefined>
  >([]);

  // Update players when gameState or playerCount changes
  useEffect(() => {
    if (gameState && gameState.players) {
      const newPlayers = gameState.players.map((player: any) => ({
        name: player.name,
        inGame: true,
      }));
      while (newPlayers.length < gameState.playerCount) {
        newPlayers.push(undefined);
      }
      setPlayers(newPlayers);
      console.log("WaitingList: Updated players from gameState", newPlayers);
    } else if (playerCount > 0) {
      // Initialize with empty slots when no gameState yet
      const emptyPlayers = Array.from({ length: playerCount }, () => undefined);
      setPlayers(emptyPlayers);
      console.log(
        "WaitingList: Initialized empty slots for",
        playerCount,
        "players",
      );
    }
  }, [gameState, playerCount]);

  useEffect(() => {
    if (!socket) {
      console.log("WaitingList: No socket available");
      return;
    }

    console.log("WaitingList: Setting up game-state-update listener");

    const handleGameStateUpdate = (response: any) => {
      console.log(
        "WaitingList: Received game-state-update",
        response.gameState,
      );
      const newPlayers = response.gameState.players.map((player: any) => ({
        name: player.name,
        inGame: true,
      }));
      while (newPlayers.length < response.gameState.playerCount) {
        newPlayers.push(undefined);
      }
      setPlayers(newPlayers);
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

  const isHost = gameState?.players?.[0]?.name === playerName;
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
