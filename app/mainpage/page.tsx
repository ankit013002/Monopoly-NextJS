"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const Mainpage = () => {
  const server_url = process.env.SERVER || "http://localhost:5000";
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [roomId, setRoomId] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(server_url);
    socketRef.current = newSocket;

    newSocket.on("game-created", (data) => {
      console.log("Game created:", data);
    });

    newSocket.on("player-joined", (data) => {
      console.log("Player joined:", data);
    });

    return () => newSocket.close();
  }, [server_url]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${server_url}/room/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberOfPlayers,
        }),
      });

      const resJson = await response.json();
      console.log(`Response: ${resJson.message}`);
      if (resJson.gameId && socketRef.current) {
        socketRef.current.emit("join-room", resJson.gameId);
      }
    } catch (err) {
      console.error("Error: ", err);
    }

    // redirect(`/gamepage?players=${numberOfPlayers}`);
  };

  const joinRoom = async () => {
    try {
      const response = await fetch(`${server_url}/room/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId: roomId }),
      });

      const resJson = await response.json();
      console.log(`Response: ${resJson.message}`);
      if (socketRef.current) {
        socketRef.current.emit("join-room", roomId);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <div className="text-center font-black tracking-[0.35em] text-xl md:text-3xl">
          MONOPOLY
        </div>
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
        <button onClick={() => handleSubmit()} className="btn btn-ghost">
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
