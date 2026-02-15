"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import WaitingList from "./(components)/WaitingList";

const Mainpage = () => {
  const server_url = process.env.SERVER || "http://localhost:5000";
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const [createGameSuccessful, setCreateGameSuccessful] = useState(false);
  const gameIdRef = useRef<number | null>(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const newSocket = io(server_url);
    socketRef.current = newSocket;

    newSocket.on("create-game-confirmation", (response) => {
      console.log(response.message);
      gameIdRef.current = parseInt(response.gameId);
      setGameState(response.gameState);
      setCreateGameSuccessful(true);
    });

    newSocket.on("join-game-confirmation", (response) => {
      console.log(response.message);
      gameIdRef.current = parseInt(response.gameId);
      setGameState(response.gameState);
      setCreateGameSuccessful(true);
    });

    newSocket.on("game-started", (response) => {
      window.location.href = `/gamepage?gameId=${response.gameId}&players=${response.playerCount}`;
    });
  }, [server_url]);

  const handleSubmit = async () => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("create-game", {
      player: playerName,
      playerCount: numberOfPlayers,
    });
  };

  const joinRoom = async () => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit("join-game", {
      player: playerName,
      gameIdString: roomId,
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {createGameSuccessful && (
        <div className="absolute right-[5%]">
          <WaitingList
            playerName={playerName}
            playerCount={numberOfPlayers}
            socket={socketRef.current}
            gameId={gameIdRef.current}
            gameState={gameState}
          />
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="text-center font-black tracking-[0.35em] text-xl md:text-3xl">
          MONOPOLY
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          className="input input-bordered w-full max-w-xs"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <select
          onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
          defaultValue="Number of Players"
          className="select"
        >
          <option disabled={true}>Number of Players</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
        <button
          disabled={createGameSuccessful}
          onClick={() => handleSubmit()}
          className="btn btn-ghost"
        >
          Create Room
        </button>
        <input
          type="text"
          placeholder="Room ID"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={() => joinRoom()} className="btn btn-ghost">
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Mainpage;
