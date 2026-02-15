"use client";

import { redirect } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

interface WaitingList {
  playerName: string;
  playerCount: number;
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
  gameState: any;
}

const WaitingList = ({
  playerName,
  playerCount,
  socket,
  gameId,
  gameState,
}: WaitingList) => {
  const clientSocket = useRef(socket);
  const [players, setPlayers] = useState(() => {
    if (gameState) {
      const newPlayers = gameState.players.map((player) => ({
        name: player.name,
        inGame: true,
      }));
      while (newPlayers.length < gameState.playerCount) {
        newPlayers.push(undefined);
      }
      return newPlayers;
    } else {
      const allPlayers = Array.from({ length: playerCount - 1 });
      allPlayers.push({
        name: playerName,
        inGame: true,
      });
      console.log(allPlayers);
      return allPlayers.reverse();
    }
  });

  useEffect(() => {
    if (!clientSocket.current) {
      return;
    }

    clientSocket.current.on("game-state-update", (response) => {
      console.log(response.gameState);
      setPlayers(() => {
        const newPlayers = response.gameState.players.map((player) => {
          return {
            name: player.name,
            inGame: true,
          };
        });
        while (newPlayers.length < response.gameState.playerCount) {
          newPlayers.push(undefined);
        }
        return newPlayers;
      });
    });
  }, [clientSocket.current]);

  const startGame = () => {
    if (!clientSocket.current) return;
    clientSocket.current.emit("start-game", { gameId });
  };

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
        disabled={
          playerCount != players.length || playerName !== players[0]?.name
        }
        className="btn w-full bg-green-700"
        onClick={() => startGame()}
      >
        Start Game
      </button>
    </div>
  );
};

export default WaitingList;
