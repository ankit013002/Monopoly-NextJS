"use client";

import { useState } from "react";

const Mainpage = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (numberOfPlayers < 2) {
      setError("Please select the number of players.");
      return;
    }
    setError("");
    window.location.href = `/gamepage?action=create&playerName=${encodeURIComponent(playerName)}&playerCount=${numberOfPlayers}`;
  };

  const joinRoom = () => {
    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!roomId.trim()) {
      setError("Please enter a Room ID.");
      return;
    }
    setError("");
    window.location.href = `/gamepage?action=join&playerName=${encodeURIComponent(playerName)}&gameId=${roomId}`;
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      {/* Decorative board corner tiles */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-red-600 opacity-20 rounded-br-full" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 opacity-20 rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500 opacity-20 rounded-tr-full" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400 opacity-20 rounded-tl-full" />

      {/* Floating property card decorations */}
      <div className="absolute left-8 top-1/4 hidden lg:block rotate-[-8deg] opacity-30">
        <div className="w-20 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded">
          <div className="h-5 bg-red-500 rounded-t" />
          <div className="p-2 text-white text-[8px] font-bold">BOARDWALK</div>
          <div className="p-1 text-white/60 text-[7px]">$400</div>
        </div>
      </div>
      <div className="absolute right-8 top-1/3 hidden lg:block rotate-[6deg] opacity-30">
        <div className="w-20 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded">
          <div className="h-5 bg-blue-600 rounded-t" />
          <div className="p-2 text-white text-[8px] font-bold">PARK PLACE</div>
          <div className="p-1 text-white/60 text-[7px]">$350</div>
        </div>
      </div>
      <div className="absolute left-12 bottom-1/3 hidden lg:block rotate-[5deg] opacity-30">
        <div className="w-20 border-2 border-white/30 bg-white/10 backdrop-blur-sm rounded">
          <div className="h-5 bg-yellow-400 rounded-t" />
          <div className="p-2 text-white text-[8px] font-bold">
            MARVIN GARDENS
          </div>
          <div className="p-1 text-white/60 text-[7px]">$280</div>
        </div>
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-block px-8 py-4 border-4 border-white rotate-[-1deg] shadow-2xl mb-2"
            style={{ background: "linear-gradient(135deg, #e63946, #d62828)" }}
          >
            <div className="rotate-[1deg]">
              <div className="text-white font-black tracking-[0.4em] text-4xl md:text-5xl drop-shadow-lg">
                MONOPOLY
              </div>
            </div>
          </div>
          <p className="text-white/50 text-sm tracking-widest uppercase mt-3">
            Online Multiplayer
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6">
          {/* Player name — shared */}
          <div className="mb-5">
            <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl bg-black/30 p-1 mb-5 gap-1">
            <button
              onClick={() => {
                setActiveTab("create");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "create"
                  ? "bg-white text-black shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🏠 Create Game
            </button>
            <button
              onClick={() => {
                setActiveTab("join");
                setError("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "join"
                  ? "bg-white text-black shadow"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🚪 Join Game
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "create" ? (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  Number of Players
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setNumberOfPlayers(n);
                        setError("");
                      }}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        numberOfPlayers === n
                          ? "bg-white text-black border-white shadow-lg scale-105"
                          : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {n} Players
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2dc653, #1a8a38)",
                }}
              >
                🎲 Create Room
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-1.5">
                  Room ID
                </label>
                <input
                  type="text"
                  placeholder="Enter room ID..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    setError("");
                  }}
                />
              </div>
              <button
                onClick={joinRoom}
                className="w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #e9c46a, #f4a261)",
                }}
              >
                🚀 Join Room
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg px-3 py-2 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-6 tracking-widest">
          🎩 🚂 🐕 🎡 — CLASSIC EDITION
        </p>
      </div>
    </div>
  );
};

export default Mainpage;
