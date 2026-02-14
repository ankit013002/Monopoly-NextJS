"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";

interface WaitingList {
  playerName: string;
  playerCount: number;
  socket: SocketIOClient.Socket | null;
  gameId: number | null;
}

const WaitingList = ({
  playerName,
  playerCount,
  socket,
  gameId,
}: WaitingList) => {
  const clientSocket = useRef(socket);
  const [players, setPlayers] = useState([playerName]);

  useEffect(() => {
    if (!clientSocket.current) {
      return;
    }

    clientSocket.current.on("player-joined", (message: String) => {
      console.log(`${message} joined`);
    });
  }, [clientSocket.current]);

  return (
    <div>
      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Game ID: {gameId}
        </li>

        <li className="list-row items-center">
          <div className="text-4xl font-thin opacity-30 tabular-nums">{1}</div>
          <div className="list-col-grow">
            <div>{playerName}</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Joined
            </div>
          </div>
          <FaCheck />
        </li>

        {Array.from({ length: playerCount - 1 }).map((_, index) => {
          return (
            <li key={index} className="list-row items-center">
              <div className="text-4xl font-thin opacity-30 tabular-nums">
                {index + 2}
              </div>
              <div className="list-col-grow">
                <div>Dio Lupa</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  Waiting
                </div>
              </div>
              <div>
                <span className="loading loading-spinner loading-xs"></span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WaitingList;
