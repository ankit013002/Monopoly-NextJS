"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { BOARD_CELLS, BOARD_LEN } from "../utils/BoardLayout";
import { GameStateType } from "../types/GameStateType";
import PropertyCard from "../components/PropertyCard";
import PlayerStats from "../components/PlayerStats";
import WaitingList from "./(components)/WaitingList";
import { PlayerType } from "../types/PlayerType";
import DiceRoller from "../components/DiceRoller";
import PlayerList from "../components/PlayerList";
import { lastRollType } from "../types/lastRollType";
import EndTurnButton from "../components/EndTurnButton";
import { Board } from "../components/Board";
import TradingModal from "../components/TradingModal";
import { TradeType } from "../types/TradeType";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function Home() {
  const [gameId, setGameId] = useState<number | null>(null);
  const [lastRoll, setLastRoll] = useState<lastRollType>(null);
  const [showWaitingModal, setShowWaitingModal] = useState(true);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedPlayerToView, setSelectedPlayerToView] =
    useState<PlayerType | null>(null);
  const [mustPayRent, setMustPayRent] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [tradeWithPlayer, setTradeWithPlayer] = useState<PlayerType | null>(
    null,
  );
  const [incomingTrade, setIncomingTrade] = useState<TradeType | null>(null);

  const isPlayerTurn = useMemo(() => {
    if (!gameState) return false;
    const currentPlayer = gameState.players[gameState.playerTurnIndex];
    if (!currentPlayer || !currentPlayer.socketId) return false;
    return currentPlayer.socketId === socket?.id;
  }, [gameState, socket?.id]);

  const selectedToken = useMemo<PlayerType | undefined>(
    () =>
      gameState?.players.find(
        (_, index) => index === gameState.playerTurnIndex,
      ) ?? gameState?.players[0],
    [gameState],
  );

  const currentPlayer = useMemo(() => {
    if (!gameState || !socket?.id) return null;
    return gameState.players.find((p) => p.socketId === socket.id) ?? null;
  }, [gameState, socket?.id]);

  const effectiveTradePartner = useMemo(() => {
    if (incomingTrade && gameState)
      return (
        gameState.players.find((p) => p.socketId === incomingTrade.from) ?? null
      );
    if (tradeWithPlayer) return tradeWithPlayer;
    return null;
  }, [tradeWithPlayer, incomingTrade, gameState]);

  const landedOnPropertyId = useMemo(() => {
    if (!selectedToken || !gameState) return null;
    return (
      Object.values(gameState.allProperties)
        .flat()
        .find((space) => space.id === selectedToken.position) ?? null
    )?.id;
  }, [gameState, selectedToken]);

  useEffect(() => {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
    const newSocket = io(serverUrl);
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on(
      "game-state-update",
      (response: { gameState: GameStateType }) => {
        console.log("Game state updated:", response.gameState);
        setGameState(response.gameState);
      },
    );

    newSocket.on("trade-offer", (response: TradeType) => {
      setIncomingTrade(response);
    });

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, []);

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

    // Get starting position from current game state
    const startingPlayer = gameState?.players.find(
      (p) => p.socketId === socketId,
    );
    let positionTracker = startingPlayer?.position ?? 0;

    for (let i = 0; i < steps; i++) {
      positionTracker = (positionTracker + 1) % BOARD_LEN;

      setGameState((prev) => {
        const prevPlayers = prev?.players;
        if (!prevPlayers) {
          return prev;
        }
        const players = prevPlayers.map((p) => {
          if (p.socketId === socketId) {
            const updatedPlayer = { ...p, position: positionTracker };
            if (positionTracker === 0 && p.position !== 0) {
              console.log("Player passed GO!");
              updatedPlayer.balance += 200;
            }
            landedOnSpaceId = positionTracker;
            return updatedPlayer;
          } else {
            return p;
          }
        });
        const newGameState = {
          ...prev,
          players,
        };
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
      {showWaitingModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <div className="max-w-md">
            <WaitingList
              socket={socket}
              gameId={gameId}
              gameState={gameState}
              setGameState={setGameState}
              setGameId={setGameId}
              setShowWaitingModal={setShowWaitingModal}
            />
          </div>
        </div>
      )}

      {gameState && currentPlayer && effectiveTradePartner && (tradeWithPlayer || incomingTrade) && (
        <div className="fixed w-screen h-screen inset-0 z-[9999] bg-black/80 flex items-center justify-center">
          <div className="max-w-md">
            <TradingModal
              currentPlayer={currentPlayer}
              tradeWithPlayer={effectiveTradePartner}
              gameId={gameId}
              gameState={gameState}
              socket={socket}
              setTradeWithPlayer={setTradeWithPlayer}
              incomingTrade={incomingTrade}
              setIncomingTrade={setIncomingTrade}
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
          <div className="absolute top-1 left-1 z-10 flex flex-col gap-2 w-[min(240px,30vw)]">
            <PlayerList
              selectedPlayerToView={selectedPlayerToView}
              setPlayerToView={setSelectedPlayerToView}
              gameState={gameState}
            />
            <PlayerStats
              playerRef={selectedPlayerToView}
              currentPlayer={currentPlayer}
              socket={socket}
              allProperties={gameState.allProperties}
              setTradeWithPlayer={setTradeWithPlayer}
            />
          </div>

          <div className="absolute bottom-1 right-1 z-10 flex">
            <EndTurnButton
              socket={socket}
              gameId={gameId}
              lastRoll={lastRoll}
              mustPayRent={mustPayRent}
              setLastRoll={setLastRoll}
            />
          </div>

          {/* TODO: Need to avoid allowing player to buy property when their turn starts */}
          {landedOnPropertyId &&
            isPlayerTurn &&
            !isMoving &&
            lastRoll &&
            selectedToken && (
              <PropertyCard
                socket={socket}
                gameId={gameId}
                allProperties={gameState.allProperties}
                playerRef={selectedToken}
                propertyId={landedOnPropertyId}
                mustPayRent={mustPayRent}
                setMustPayRent={setMustPayRent}
              />
            )}

          <div className="z-10 absolute right-1 top-1 w-[min(280px,40vw)] rounded-xl border border-white/15 bg-linear-to-b from-black/95 to-black/85 backdrop-blur-sm shadow-xl shadow-black/50 text-white overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
              <div className="w-1 h-3 rounded-full bg-yellow-400" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                Game HUD
              </span>
            </div>

            <div className="p-3 flex flex-col gap-2 text-xs">
              {/* Current turn */}
              <div className="bg-yellow-400/8 rounded-lg p-2.5 border border-yellow-400/20">
                <div className="text-[10px] text-yellow-400/60 uppercase tracking-wider mb-0.5">
                  Current Turn
                </div>
                <div className="font-bold text-yellow-300 text-sm">
                  {selectedToken?.name ?? "—"}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5 truncate">
                  {landedOnPropertyName}
                </div>
              </div>

              {/* Last roll */}
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                  Last Roll
                </div>
                <div className="font-mono text-sm">
                  <span className="text-white/70">
                    {gameState.lastRoll ? gameState.lastRoll.d1 : 0}
                  </span>
                  <span className="text-white/30 mx-1">+</span>
                  <span className="text-white/70">
                    {gameState.lastRoll ? gameState.lastRoll.d2 : 0}
                  </span>
                  <span className="text-white/30 mx-1">=</span>
                  <span className="text-yellow-300 font-bold">
                    {gameState.lastRoll ? gameState.lastRoll.total : 0}
                  </span>
                </div>
              </div>
            </div>

            {isPlayerTurn && (
              <div className="mx-3 mb-3 p-3 bg-linear-to-r from-white/8 to-white/4 rounded-lg border border-white/15">
                <DiceRoller
                  selectedToken={selectedToken}
                  playerTurn={playerTurn}
                  moveTokenSteps={moveTokenSteps}
                  lastRoll={lastRoll}
                  setLastRoll={setLastRoll}
                  isMoving={isMoving}
                  socket={socket}
                  gameId={gameId}
                />
              </div>
            )}
          </div>

          <Board gameState={gameState} />
        </>
      )}
    </div>
  );
}
