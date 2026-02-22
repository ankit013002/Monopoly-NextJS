// app/page.tsx
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import TokensLayer from "../components/TokensLayer";
import { BOARD_CELLS, BOARD_LEN } from "../utils/BoardLayout";
import { Cell } from "../components/Cell";
import { CORNERS } from "../utils/Corners";
import { ALL_PROPERTIES } from "../utils/Properties";
import BoardCenter from "../components/BoardCenter";
import { redirect, useSearchParams } from "next/navigation";
import { GameStateType } from "../types/GameStateType";
import PropertyCard from "../components/PropertyCard";
import PlayerStats from "../components/PlayerStats";
import WaitingList from "./(components)/WaitingList";
import { PlayerType } from "../types/PlayerType";
import DiceRoller from "../components/DiceRoller";
// import MovementDev from "../components/MovementDev";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function Home() {
  const [gameId, setGameId] = useState<number | null>(null);
  const serverUrlRef = useRef<string>("");
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [selectedPlayerSocketId, setSelectedPlayerSocketId] =
    useState<string>("");
  const [lastRoll, setLastRoll] = useState<{
    d1: number;
    d2: number;
    total: number;
  } | null>(null);

  // Waiting room state
  const [showWaitingModal, setShowWaitingModal] = useState(true);
  const [playerCount, setPlayerCount] = useState(0);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const isPlayerTurn = useMemo(() => {
    if (!gameState || !player) return false;
    const currentPlayer = gameState.players[gameState.playerTurnIndex];
    if (!currentPlayer || !currentPlayer.socketId) return false;
    return currentPlayer.socketId === player.socketId;
  }, [gameState, player]);
  const selectedToken = useMemo(
    () =>
      gameState?.players.find(
        (_, index) => index === gameState.playerTurnIndex,
      ) ?? gameState?.players[0],
    [gameState],
  );

  const landedOnPropertyId = useMemo(() => {
    if (!selectedToken || !gameState) return null;
    return (
      Object.values(gameState.allProperties)
        .flat()
        .find((space) => space.id === selectedToken.position) ?? null
    )?.id;
  }, [gameState, selectedToken]);

  const searchParams = useSearchParams();

  console.log("All properties:", gameState?.allProperties);

  useEffect(() => {
    const action = searchParams.get("action"); // "create" or "join"
    const name = searchParams.get("playerName");
    const gameIdParam = searchParams.get("gameId");
    const playerCountParam = searchParams.get("playerCount");

    serverUrlRef.current =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    if (!action || !name) {
      redirect("/");
    }

    console.log("GamePage: Creating socket connection");
    const newSocket = io(serverUrlRef.current);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("GamePage: Socket connected with ID:", newSocket.id);

      if (action === "create") {
        const count = parseInt(playerCountParam || "2");
        console.log("GamePage: Creating game for", count, "players");
        newSocket.emit("create-game", {
          player: name,
          playerCount: count,
          allProperties: ALL_PROPERTIES,
        });
      } else if (action === "join" && gameIdParam) {
        console.log("GamePage: Joining game", gameIdParam);
        newSocket.emit("join-game", {
          player: name,
          gameIdString: gameIdParam,
        });
      }
    });

    newSocket.on("create-game-confirmation", (response: any) => {
      console.log("Game created:", response.gameId);
      setGameId(parseInt(response.gameId));
      const responseGameState = response.gameState as GameStateType;
      setPlayer(
        responseGameState.players.find((p) => p.socketId === newSocket.id) ??
          null,
      );
      setGameState(responseGameState);
      setPlayerCount(responseGameState.playerCount);
    });

    newSocket.on("join-game-confirmation", (response: any) => {
      console.log("Joined game:", response.gameId);
      setGameId(parseInt(response.gameId));
      setPlayerCount(response.gameState.playerCount);
      setGameState(response.gameState);
      setPlayer(
        response.gameState.players.find((p) => p.socketId === newSocket.id) ??
          null,
      );
    });

    newSocket.on("game-state-update", (response: any) => {
      console.log("Game state updated:", response.gameState);
      setGameState(response.gameState);
      setPlayer(
        response.gameState.players.find((p) => p.socketId === newSocket.id) ??
          null,
      );
    });

    newSocket.on("game-started", (response: any) => {
      console.log("Game started!");
      setShowWaitingModal(false);
      console.log("Initial game state:", response.gameState);
      setGameState(response.gameState);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [searchParams]);

  const landedOnPropertyName = selectedToken
    ? (BOARD_CELLS[selectedToken.position]?.space?.name ?? "Unknown")
    : "Unknown";

  async function playerTurn(socketId: string, steps: number) {
    const spaceId = await moveTokenSteps(socketId, steps);
    if (spaceId >= 40 || spaceId < 0) {
      console.error(`Invalid space: ${spaceId}`);
      return null;
    }
    if (!gameState?.allProperties) {
      console.error("Game properties are not loaded yet.");
      return null;
    }
    const property = Object.values(gameState.allProperties)
      .flat()
      .find((space) => space.id === spaceId);
    if (!property) {
      console.error(`Invalid Property: ${spaceId}`);
      return null;
    }
  }

  async function moveTokenSteps(socketId: string, steps: number) {
    if (isMoving) return -1;

    setIsMoving(true);
    let landedOnSpaceId = 0;
    for (let i = 0; i < steps; i++) {
      setGameState((prev) => {
        const prevPlayers = prev?.players;
        if (!prevPlayers) {
          return prev;
        }
        const players = prevPlayers.map((p) => {
          if (p.socketId === socketId) {
            const position =
              p.socketId === socketId
                ? (p.position + 1) % BOARD_LEN
                : p.position;
            landedOnSpaceId = position;
            return { ...p, position };
          } else {
            return p;
          }
        });
        const newGameState = { ...prev, players };
        socket?.emit("move-token", {
          gameId: gameId,
          newGameState,
        });
        return newGameState;
      });
      await sleep(120);
    }
    setIsMoving(false);
    return landedOnSpaceId;
  }

  return (
    <div className="min-h-screen bg-board flex items-center justify-center p-4">
      {/* Waiting Room Modal */}
      {gameState && showWaitingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <div className="max-w-md">
            <WaitingList
              playerCount={playerCount}
              socket={socket}
              gameId={gameId}
              gameState={gameState}
            />
          </div>
        </div>
      )}

      {/* Game UI - only render when game state is loaded */}
      {!gameState ? (
        <div className="text-white text-center">
          <div className="text-xl mb-2">Loading game...</div>
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <>
          {/* Rest of game UI */}
          <div className="absolute top-1 left-1 flex flex-col gap-2">
            <div className="rounded-xl border border-black/30 bg-black/80 shadow-md p-3">
              <div className="font-bold text-sm mb-2">Players</div>
              <div className="flex flex-col gap-2">
                {gameState.players.map((player, index) => {
                  const isSelected = index === gameState.playerTurnIndex;
                  console.log("Player: ", player);

                  return (
                    <div
                      key={player.socketId}
                      className={[
                        "flex items-center justify-between rounded-md border px-3 py-2 text-xs",
                        "transition-colors",
                        isSelected
                          ? "bg-white/40 border-white/80"
                          : "bg-white/5 border-white/20",
                      ].join(" ")}
                    >
                      {/* Left: color + ID */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full border border-black/40 bg-${player.color}`}
                        />
                        <span className="font-semibold">{player.name}</span>
                      </div>

                      {/* Right: stats */}
                      <div className="text-right leading-tight">
                        <div className="font-semibold">
                          {/*${player.balance.toLocaleString()} */}
                        </div>
                        <div className="opacity-80">
                          Pos {player.position} • {player.ownedSpaces.length}{" "}
                          props
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {isPlayerTurn && (
              <PlayerStats
                playerRef={player}
                socket={socket}
                gameId={gameId}
                allProperties={gameState.allProperties}
              />
            )}
          </div>

          {/* TODO: Need to avoid allowing player to buy property when their turn starts */}
          {landedOnPropertyId && isPlayerTurn && !isMoving && (
            <PropertyCard
              socket={socket}
              gameId={gameId}
              allProperties={gameState.allProperties}
              playerRef={player}
              propertyId={landedOnPropertyId}
            />
          )}

          <div className="z-[1000] absolute right-1 top-1 w-[min(380px,70vw)] rounded-xl border border-black/30 bg-black/80 shadow-md p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-sm">Players</div>
              <div className="flex items-center gap-2"></div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-sm">
                <div className="font-semibold">
                  Selected: {selectedToken?.name ?? "-"}
                </div>
                <div className="text-xs opacity-80">
                  On: {landedOnPropertyName}
                </div>
              </div>

              {lastRoll ? (
                <div className="text-right text-xs">
                  <div className="font-semibold">Last roll</div>
                  <div>
                    {lastRoll.d1} + {lastRoll.d2} = {lastRoll.total}
                  </div>
                </div>
              ) : (
                <div className="text-right text-xs opacity-70">No roll yet</div>
              )}
            </div>

            {isPlayerTurn && (
              <DiceRoller
                selectedToken={selectedToken}
                playerTurn={playerTurn}
                moveTokenSteps={moveTokenSteps}
                lastRoll={lastRoll}
                setLastRoll={setLastRoll}
                isMoving={isMoving}
              />
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {gameState.players.map((player) => (
                <button
                  key={player.socketId}
                  onClick={() => setSelectedPlayerSocketId(player.socketId)}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold border border-black/30",
                    "hover:bg-black/5",
                    selectedPlayerSocketId === player.socketId
                      ? "bg-black/10"
                      : "bg-white",
                  ].join(" ")}
                  disabled={isMoving}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-[min(92vw,92vh)] max-w-[980px] aspect-square">
            <div className="h-full w-full border-2 border-black/60 bg-white/60 shadow-lg">
              <div className="relative grid h-full w-full grid-cols-13 grid-rows-13">
                {/* Corners (2x2) */}
                <Cell
                  space={CORNERS.topLeft}
                  edge="corner"
                  isCorner
                  gridColumn={1}
                  gridRow={1}
                  colSpan={2}
                  rowSpan={2}
                />
                <Cell
                  space={CORNERS.topRight}
                  edge="corner"
                  isCorner
                  gridColumn={12}
                  gridRow={1}
                  colSpan={2}
                  rowSpan={2}
                />
                <Cell
                  space={CORNERS.bottomLeft}
                  edge="corner"
                  isCorner
                  gridColumn={1}
                  gridRow={12}
                  colSpan={2}
                  rowSpan={2}
                />
                <Cell
                  space={CORNERS.bottomRight}
                  edge="corner"
                  isCorner
                  gridColumn={12}
                  gridRow={12}
                  colSpan={2}
                  rowSpan={2}
                />

                {/* Top edge (row 1-2, col 3-11) left->right */}
                {gameState.allProperties.topProperties.map((space, i) => (
                  <Cell
                    key={`top-${i}`}
                    space={space}
                    edge="top"
                    rotate={180}
                    gridColumn={3 + i}
                    gridRow={1}
                    colSpan={1}
                    rowSpan={2}
                  />
                ))}

                {/* Bottom edge (row 12-13, col 3-11) left->right */}
                {gameState.allProperties.bottomProperties.map((space, i) => (
                  <Cell
                    key={`bottom-${i}`}
                    space={space}
                    edge="bottom"
                    rotate={0}
                    gridColumn={3 + i}
                    gridRow={12}
                    colSpan={1}
                    rowSpan={2}
                  />
                ))}

                {/* Left edge (col 1-2, row 3-11) top->bottom */}
                {gameState.allProperties.leftProperties.map((space, i) => (
                  <Cell
                    key={`left-${i}`}
                    space={space}
                    edge="left"
                    rotate={90}
                    gridColumn={1}
                    gridRow={3 + i}
                    colSpan={2}
                    rowSpan={1}
                  />
                ))}

                {/* Right edge (col 12-13, row 3-11) top->bottom */}
                {gameState.allProperties.rightProperties.map((space, i) => (
                  <Cell
                    key={`right-${i}`}
                    space={space}
                    edge="right"
                    rotate={-90}
                    gridColumn={12}
                    gridRow={3 + i}
                    colSpan={2}
                    rowSpan={1}
                  />
                ))}

                {/* Center (9x9) + HUD */}
                <BoardCenter />

                {/* Tokens overlay (on top of cells) */}
                <TokensLayer
                  tokens={gameState.players}
                  board={BOARD_CELLS}
                  selectedId={selectedPlayerSocketId}
                  onSelect={setSelectedPlayerSocketId}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
