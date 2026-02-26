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
import PlayerList from "../components/PlayerList";
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
  const [mustPayRent, setMustPayRent] = useState(false);

  const landedOnPropertyId = useMemo(() => {
    if (!selectedToken || !gameState) return null;
    return (
      Object.values(gameState.allProperties)
        .flat()
        .find((space) => space.id === selectedToken.position) ?? null
    )?.id;
  }, [gameState, selectedToken]);

  const searchParams = useSearchParams();

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

    newSocket.on(
      "create-game-confirmation",
      (response: { gameId: string; gameState: GameStateType }) => {
        console.log("Game created:", response.gameId);
        setGameId(parseInt(response.gameId));
        const responseGameState = response.gameState as GameStateType;
        setPlayer(
          responseGameState.players.find((p) => p.socketId === newSocket.id) ??
            null,
        );
        setGameState(responseGameState);
        setPlayerCount(responseGameState.playerCount);
      },
    );

    newSocket.on(
      "join-game-confirmation",
      (response: { gameId: string; gameState: GameStateType }) => {
        console.log("Joined game:", response.gameId);
        setGameId(parseInt(response.gameId));
        setPlayerCount(response.gameState.playerCount);
        setGameState(response.gameState);
        setPlayer(
          response.gameState.players.find((p) => p.socketId === newSocket.id) ??
            null,
        );
      },
    );

    newSocket.on(
      "game-state-update",
      (response: { gameState: GameStateType }) => {
        console.log("Game state updated:", response.gameState);
        setGameState(response.gameState);
        setPlayer(
          response.gameState.players.find((p) => p.socketId === newSocket.id) ??
            null,
        );
      },
    );

    newSocket.on("game-started", (response: { gameState: GameStateType }) => {
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
            const newPosition = (p.position + 1) % BOARD_LEN;
            const updatedPlayer = { ...p, position: newPosition };
            if (newPosition === 0 && p.position !== 0) {
              console.log("Player passed GO!");
              updatedPlayer.balance += 200;
            }
            landedOnSpaceId = newPosition;
            return updatedPlayer;
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
            <PlayerList gameState={gameState} />
            {isPlayerTurn && (
              <PlayerStats
                playerRef={player}
                socket={socket}
                gameId={gameId}
                allProperties={gameState.allProperties}
                lastRoll={lastRoll}
                setLastRoll={setLastRoll}
                mustPayRent={mustPayRent}
              />
            )}
          </div>

          {/* TODO: Need to avoid allowing player to buy property when their turn starts */}
          {landedOnPropertyId && isPlayerTurn && !isMoving && lastRoll && (
            <PropertyCard
              socket={socket}
              gameId={gameId}
              allProperties={gameState.allProperties}
              playerRef={player}
              propertyId={landedOnPropertyId}
              setMustPayRent={setMustPayRent}
            />
          )}

          <div className="z-[1000] absolute right-1 top-1 w-[min(380px,70vw)] rounded-xl border border-white/20 bg-black/90 backdrop-blur-sm shadow-lg p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-sm text-white">Players</div>
              <div className="flex items-center gap-2"></div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-sm text-white">
                <div className="font-semibold">
                  Selected: {selectedToken?.name ?? "-"}
                </div>
                <div className="text-xs opacity-80">
                  On: {landedOnPropertyName}
                </div>
              </div>

              {lastRoll ? (
                <div className="text-right text-xs text-white">
                  <div className="font-semibold">Last roll</div>
                  <div>
                    {lastRoll.d1} + {lastRoll.d2} = {lastRoll.total}
                  </div>
                </div>
              ) : (
                <div className="text-right text-xs opacity-70 text-white">
                  No roll yet
                </div>
              )}
            </div>
            <hr className="my-3 border-white/20" />
            {isPlayerTurn && !lastRoll && (
              <div className="my-3 p-3 bg-white/10 rounded-lg border border-white/10">
                <DiceRoller
                  selectedToken={selectedToken}
                  playerTurn={playerTurn}
                  moveTokenSteps={moveTokenSteps}
                  lastRoll={lastRoll}
                  setLastRoll={setLastRoll}
                  isMoving={isMoving}
                />
              </div>
            )}
            <hr className="my-3 border-white/20" />
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
