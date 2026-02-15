"use client";

import { useState } from "react";

const Mainpage = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = () => {
    if (!playerName || numberOfPlayers < 2) {
      alert("Please enter your name and select number of players");
      return;
    }
    // Redirect to gamepage as host/creator
    window.location.href = `/gamepage?action=create&playerName=${encodeURIComponent(playerName)}&playerCount=${numberOfPlayers}`;
  };

  const joinRoom = () => {
    if (!playerName || !roomId) {
      alert("Please enter your name and room ID");
      return;
    }
    // Redirect to gamepage as joiner
    window.location.href = `/gamepage?action=join&playerName=${encodeURIComponent(playerName)}&gameId=${roomId}`;
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
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
