"use client";

import { GameStateType } from "@/app/types/GameStateType";
import { PlayerType } from "@/app/types/PlayerType";
import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Socket } from "socket.io-client";
import { redirect, useSearchParams } from "next/navigation";
import { ALL_PROPERTIES } from "@/app/utils/Properties";

interface WaitingList {
  socket: Socket | null;
  gameId: number | null;
  gameState: GameStateType | null;
  setGameState: React.Dispatch<React.SetStateAction<GameStateType | null>>;
  setGameId: React.Dispatch<React.SetStateAction<number | null>>;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerType | null>>;
  setShowWaitingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaitingList = ({
  socket,
  gameId,
  gameState,
  setGameState,
  setGameId,
  setPlayer,
  setShowWaitingModal,
}: WaitingList) => {
  const searchParams = useSearchParams();
  const [playerCount, setPlayerCount] = useState(0);
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
    const action = searchParams.get("action");
    const name = searchParams.get("playerName");
    const gameIdParam = searchParams.get("gameId");
    const playerCountParam = searchParams.get("playerCount");

    if (!action || !name) {
      redirect("/");
    }

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

    const emitJoinOrCreate = () => {
      console.log("GamePage: Socket connected with ID:", socket.id);

      if (action === "create") {
        const count = parseInt(playerCountParam || "2");
        console.log("GamePage: Creating game for", count, "players");
        socket.emit("create-game", {
          player: name,
          playerCount: count,
          allProperties: ALL_PROPERTIES,
        });
      } else if (action === "join" && gameIdParam) {
        console.log("GamePage: Joining game", gameIdParam);
        socket.emit("join-game", {
          player: name,
          gameIdString: gameIdParam,
        });
      }
    };

    if (socket.connected) {
      emitJoinOrCreate();
    } else {
      socket.on("connect", emitJoinOrCreate);
    }

    socket.on(
      "create-game-confirmation",
      (response: { gameId: string; gameState: GameStateType }) => {
        console.log("Game created:", response.gameId);
        setGameId(parseInt(response.gameId));
        const responseGameState = response.gameState as GameStateType;
        setPlayer(
          responseGameState.players.find((p) => p.socketId === socket.id) ??
            null,
        );
        setGameState(responseGameState);
        setPlayerCount(responseGameState.playerCount);
      },
    );

    socket.on(
      "join-game-confirmation",
      (response: { gameId: string; gameState: GameStateType }) => {
        console.log("Joined game:", response.gameId);
        setGameId(parseInt(response.gameId));
        setPlayerCount(response.gameState.playerCount);
        setGameState(response.gameState);
        setPlayer(
          response.gameState.players.find((p) => p.socketId === socket.id) ??
            null,
        );
      },
    );

    socket.on("game-state-update", handleGameStateUpdate);

    socket.on("game-started", (response: { gameState: GameStateType }) => {
      console.log("WaitingList: Game started!");
      setGameState(response.gameState);
      setPlayer(
        response.gameState.players.find((p) => p.socketId === socket.id) ??
          null,
      );
      setShowWaitingModal(false);
    });

    return () => {
      socket.off("connect", emitJoinOrCreate);
      socket.off("game-state-update", handleGameStateUpdate);
      socket.off("game-started");
    };
  }, [socket, setShowWaitingModal]);

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

  const startDisabled = !isHost || !allPlayersJoined;

  return (
    <div className="flex flex-col gap-3 w-80 rounded-2xl border border-white/15 bg-linear-to-b from-black/95 to-black/85 backdrop-blur-sm shadow-2xl shadow-black/60 overflow-hidden text-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-white/10">
        <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
          Waiting Room
        </div>
        <div className="text-lg font-bold text-white">Game #{gameId}</div>
      </div>

      {/* Player slots */}
      <div className="px-3 flex flex-col gap-1">
        {players.map((player, index) => (
          <div
            key={index}
            className={[
              "flex items-center gap-3 px-3 py-2.5 rounded-lg",
              player?.inGame
                ? "bg-white/8"
                : "bg-white/3 border border-white/5 border-dashed",
            ].join(" ")}
          >
            <div
              className={[
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                player?.inGame
                  ? "bg-white/15 text-white/70"
                  : "bg-white/5 text-white/20",
              ].join(" ")}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={[
                  "text-sm font-semibold truncate",
                  player?.inGame ? "text-white" : "text-white/20 italic",
                ].join(" ")}
              >
                {player?.name ?? "Empty slot"}
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider">
                {player?.inGame ? "Joined" : "Waiting..."}
              </div>
            </div>
            <div className="flex-shrink-0">
              {player?.inGame ? (
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                  <FaCheck className="text-green-400 text-[9px]" />
                </div>
              ) : (
                <span className="loading loading-spinner loading-xs text-white/20" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <div className="px-3 pb-4">
        <button
          disabled={startDisabled}
          onClick={() => startGame()}
          className={[
            "w-full py-2.5 rounded-xl border text-sm font-bold transition-all duration-150",
            startDisabled
              ? "bg-white/5 border-white/10 text-white/25 cursor-not-allowed"
              : "bg-green-600/80 border-green-500/40 text-white hover:bg-green-500/90 active:scale-95 cursor-pointer shadow-lg shadow-green-900/40",
          ].join(" ")}
        >
          {!isHost
            ? "Waiting for host..."
            : !allPlayersJoined
              ? "Waiting for players..."
              : "Start Game"}
        </button>
      </div>
    </div>
  );
};

export default WaitingList;
