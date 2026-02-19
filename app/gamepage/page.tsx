// app/page.tsx
"use client";

import {
  useMemo,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import io from "socket.io-client";
import TokensLayer from "../components/TokensLayer";
import { BOARD_CELLS, BOARD_LEN } from "../utils/BoardLayout";
import { Cell } from "../components/Cell";
import { CORNERS } from "../utils/Corners";
import {
  ALL_PROPERTIES,
  BOTTOM_PROPERTIES,
  LEFT_PROPERTIES,
  RIGHT_PROPERTIES,
  TOP_PROPERTIES,
} from "../utils/Properties";
import BoardCenter from "../components/BoardCenter";
import { TOKEN_COLORS } from "../utils/TokenColors";
import { redirect, useSearchParams } from "next/navigation";
import { GameStateType } from "../types/GameStateType";
import PropertyCard from "../components/PropertyCard";
import PlayerStats from "../components/PlayerStats";
import WaitingList from "../mainpage/(components)/WaitingList";
import { PlayerType } from "../types/PlayerType";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function Home() {
  const gameIdRef = useRef<number | null>(null);
  const serverUrlRef = useRef<string>("");
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
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
  const [playerName, setPlayerName] = useState("");
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const playerRef = useRef<PlayerType | null>(null);
  const selectedToken = useMemo(
    () =>
      gameState?.players.find(
        (player, index) => index === gameState.playerTurnIndex,
      ) ?? gameState?.players[0],
    [gameState, selectedPlayerSocketId],
  );

  // const landedOnProperty = useMemo(() => {
  //   if (!selectedToken || !gameState) return null;
  //   return (
  //     gameState.properties.find(
  //       (space) => space.id === selectedToken.position,
  //     ) ?? null
  //   );
  // }, [gameState, selectedToken]);

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

    setPlayerName(name);

    // Set playerCount immediately for creators
    if (action === "create" && playerCountParam) {
      const count = parseInt(playerCountParam);
      setPlayerCount(count);
      console.log("GamePage: Player count set to", count);
    }

    console.log("GamePage: Creating socket connection");
    const newSocket = io(serverUrlRef.current);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("GamePage: Socket connected with ID:", newSocket.id);

      if (action === "create") {
        const count = parseInt(playerCountParam || "2");
        console.log("GamePage: Creating game for", count, "players");
        newSocket.emit("create-game", {
          player: name,
          playerCount: count,
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
      gameIdRef.current = parseInt(response.gameId);
      setGameState(response.gameState);
      const responseGameState = response.gameState as GameStateType;
      playerRef.current =
        responseGameState.players.find((p) => p.socketId === newSocket.id) ??
        null;
      setPlayerCount(responseGameState.playerCount);
    });

    newSocket.on("join-game-confirmation", (response: any) => {
      console.log("Joined game:", response.gameId);
      gameIdRef.current = parseInt(response.gameId);
      setGameState(response.gameState);
      setPlayerCount(response.gameState.playerCount);
    });

    newSocket.on("game-state-update", (response: any) => {
      console.log("Game state updated:", response.gameState);
      setGameState(response.gameState);
    });

    newSocket.on("game-started", (response: any) => {
      console.log("Game started!");
      setShowWaitingModal(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [searchParams]);

  // Initialize game state when playerCount is available
  // useEffect(() => {
  //   if (playerCount > 0 && !gameState) {
  //     const players = Array.from({ length: playerCount }, (_, index) => ({
  //       id: index,
  //       color: TOKEN_COLORS[index],
  //       balance: 1500,
  //       ownedSpaces: [],
  //       position: 0,
  //     }));

  //     setGameState({
  //       playerTurnIndex: 0,
  //       properties: ALL_PROPERTIES,
  //       players,
  //     });
  //   }
  // }, [playerCount, gameState]);

  const landedOnPropertyName = selectedToken
    ? (BOARD_CELLS[selectedToken.position]?.space?.name ?? "Unknown")
    : "Unknown";

  function roll2d6() {
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    const total = d1 + d2;
    setLastRoll({ d1, d2, total });
    return total;
  }

  async function playerTurn(socketId: string, steps: number) {
    const spaceId = await moveTokenSteps(socketId, steps);
    if (spaceId >= 40 || spaceId < 0) {
      console.error(`Invalid space: ${spaceId}`);
      return null;
    }
    const property = ALL_PROPERTIES.find((space) => space.id === spaceId);
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
        console.log(
          "Moving token for socket",
          socketId,
          "Step",
          i + 1,
          "of",
          steps,
        );
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
        console.log("Emitting game state update for move:", newGameState);
        socketRef.current?.emit("move-token", {
          gameId: gameIdRef.current,
          newGameState,
        });
        return newGameState;
      });
      // socketRef.current?.emit("move-token", {
      //   gameId: gameIdRef.current,
      //   socketId,
      //   steps: 1,
      // });
      await sleep(120);
    }
    setIsMoving(false);
    return landedOnSpaceId;
  }

  function stepSelected() {
    if (!selectedToken) return;
    void playerTurn(selectedToken.socketId, 1);
  }

  function rollAndMoveSelected() {
    if (!selectedToken) return;
    const steps = roll2d6();
    void playerTurn(selectedToken.socketId, steps);
  }

  function moveByLastRoll() {
    if (!selectedToken || !lastRoll) return;
    void moveTokenSteps(selectedToken.socketId, lastRoll.total);
  }

  return (
    <div className="min-h-screen bg-board flex items-center justify-center p-4">
      {/* Waiting Room Modal */}
      {gameState && showWaitingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <div className="max-w-md">
            <WaitingList
              playerName={playerName}
              playerCount={playerCount}
              socket={socketRef.current}
              gameId={gameIdRef.current}
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
                          className="h-3 w-3 rounded-full border border-black/40"
                          style={{ backgroundColor: player.color }}
                        />
                        <span className="font-semibold">
                          P{player.socketId}
                        </span>
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
            {/* <PlayerStats
                playerRef={playerRef}
                socket={socketRef.current}
                gameId={gameIdRef.current}
              /> */}
          </div>

          {/* {landedOnProperty && (
              <PropertyCard
                setGameState={
                  setGameState as Dispatch<SetStateAction<GameStateType>>
                }
                playerRef={playerRef}
                property={landedOnProperty}
              />
            )} */}

          <div className="z-[1000] absolute right-1 top-1 w-[min(380px,70vw)] rounded-xl border border-black/30 bg-black/80 shadow-md p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-sm">Players</div>
              <div className="flex items-center gap-2"></div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-sm">
                <div className="font-semibold">
                  Selected: {selectedToken?.socketId ?? "-"}
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

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="rounded-md bg-black text-white px-3 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                onClick={rollAndMoveSelected}
                disabled={!selectedToken || isMoving}
              >
                Roll + Move
              </button>
              <button
                className="rounded-md border border-black/30 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
                onClick={moveByLastRoll}
                disabled={!selectedToken || !lastRoll || isMoving}
              >
                Move Last Roll
              </button>

              <button
                className="rounded-md border border-black/30 bg-white px-3 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
                onClick={stepSelected}
                disabled={!selectedToken || isMoving}
              >
                Step + 1
              </button>
            </div>

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
                {TOP_PROPERTIES.map((space, i) => (
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
                {BOTTOM_PROPERTIES.map((space, i) => (
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
                {LEFT_PROPERTIES.map((space, i) => (
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
                {RIGHT_PROPERTIES.map((space, i) => (
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
