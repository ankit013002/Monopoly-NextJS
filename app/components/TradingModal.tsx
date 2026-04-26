"use client";

import { useState, useMemo, useEffect } from "react";
import { GameStateType } from "@/app/types/GameStateType";
import { PlayerType } from "@/app/types/PlayerType";
import { FaTimes } from "react-icons/fa";
import { TradeType } from "../types/TradeType";
import { GROUP_STRIPE } from "../utils/Groups";
import { Socket } from "socket.io-client";

type TradeMode = "propose" | "review" | "counter";

interface TradingModalProps {
  currentPlayer: PlayerType | null;
  tradeWithPlayer: PlayerType | null;
  gameId: number | null;
  gameState: GameStateType;
  socket: Socket | null;
  setTradeWithPlayer: React.Dispatch<React.SetStateAction<PlayerType | null>>;
  incomingTrade?: TradeType | null;
  setIncomingTrade?: React.Dispatch<React.SetStateAction<TradeType | null>>;
}

export default function TradingModal({
  currentPlayer,
  tradeWithPlayer,
  gameId,
  gameState,
  socket,
  setTradeWithPlayer,
  incomingTrade,
  setIncomingTrade,
}: TradingModalProps) {
  const [isCountering, setIsCountering] = useState(false);

  const mode = useMemo<TradeMode>(() => {
    if (incomingTrade) {
      return "review";
    } else if (isCountering) {
      return "counter";
    } else {
      return "propose";
    }
  }, [incomingTrade, isCountering]);

  const [tradeOffer, setTradeOffer] = useState<TradeType>({
    from: currentPlayer?.socketId || "",
    to: tradeWithPlayer?.socketId || "",
    offer: {
      money: 0,
      properties: [],
    },
    request: {
      money: 0,
      properties: [],
    },
  });

  // Get properties owned by current player
  const currentPlayerProperties = useMemo(() => {
    if (!currentPlayer || !gameState.allSpaces) return [];
    const allProps = Object.values(gameState.allSpaces).flat();
    return allProps.filter(
      (prop) => prop.ownedBy?.socketId === currentPlayer.socketId,
    );
  }, [currentPlayer, gameState.allSpaces]);

  // Get properties owned by other player
  const otherPlayerProperties = useMemo(() => {
    if (!tradeWithPlayer || !gameState.allSpaces) return [];
    const allProps = Object.values(gameState.allSpaces).flat();
    return allProps.filter(
      (prop) => prop.ownedBy?.socketId === tradeWithPlayer.socketId,
    );
  }, [tradeWithPlayer, gameState.allSpaces]);

  const incomingOfferProperties = useMemo(() => {
    const allProps = Object.values(gameState.allSpaces).flat();
    return (incomingTrade?.offer.properties ?? [])
      .map((id) => allProps.find((p) => p.id === id))
      .filter(Boolean);
  }, [incomingTrade, gameState.allSpaces]);

  const incomingRequestProperties = useMemo(() => {
    const allProps = Object.values(gameState.allSpaces).flat();
    return (incomingTrade?.request.properties ?? [])
      .map((id) => allProps.find((p) => p.id === id))
      .filter(Boolean);
  }, [incomingTrade, gameState.allSpaces]);

  const handleTogglePropertyOffered = (propertyId: number) => {
    setTradeOffer((prev) => ({
      ...prev,
      offer: {
        ...prev.offer,
        properties: prev.offer.properties.includes(propertyId)
          ? prev.offer.properties.filter((id) => id !== propertyId)
          : [...prev.offer.properties, propertyId],
      },
    }));
  };

  const handleTogglePropertyWanted = (propertyId: number) => {
    setTradeOffer((prev) => ({
      ...prev,
      request: {
        ...prev.request,
        properties: prev.request.properties.includes(propertyId)
          ? prev.request.properties.filter((id) => id !== propertyId)
          : [...prev.request.properties, propertyId],
      },
    }));
  };

  const close = () => {
    setTradeWithPlayer(null);
    setIncomingTrade?.(null);
  };

  const handleSubmit = () => {
    if (!currentPlayer || !tradeWithPlayer || gameId === null) return;
    if (!socket) {
      console.error("No socket connection available");
      return;
    }
    socket.emit("request-trade", { gameId, tradeOffer });
    close();
  };

  const handleAccept = () => {
    if (!socket || gameId === null || !incomingTrade) return;
    socket.emit("accept-trade", { gameId, trade: incomingTrade });
    close();
  };

  const handleDecline = () => {
    if (!socket || gameId === null || !incomingTrade) return;
    socket.emit("decline-trade", { gameId, trade: incomingTrade });
    close();
  };

  const handleCounter = () => {
    setTradeOffer({
      from: currentPlayer?.socketId || "",
      to: tradeWithPlayer?.socketId || "",
      offer: {
        money: incomingTrade?.request.money ?? 0,
        properties: incomingTrade?.request.properties ?? [],
      },
      request: {
        money: incomingTrade?.offer.money ?? 0,
        properties: incomingTrade?.offer.properties ?? [],
      },
    });
    setIsCountering(true);
  };

  if (!currentPlayer || !tradeWithPlayer) {
    return null;
  }

  return (
    <div className="w-96 rounded-2xl border border-white/15 bg-linear-to-b from-black/95 to-black/85 backdrop-blur-sm shadow-2xl shadow-black/60 overflow-hidden text-white max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 px-5 pt-5 pb-3 border-b border-white/10 flex items-center justify-between bg-black/50">
        <div>
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">
            {mode === "review"
              ? "Incoming Trade Offer"
              : mode === "counter"
                ? "Counter Offer"
                : "Trade Negotiation"}
          </div>
          <div className="text-sm font-semibold">
            {mode === "review"
              ? `${tradeWithPlayer.name} → You`
              : `${currentPlayer.name} ↔ ${tradeWithPlayer.name}`}
          </div>
        </div>
        <button
          onClick={close}
          className="text-white/50 hover:text-white transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {mode === "review" ? (
          <>
            {/* What they're offering */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
                {tradeWithPlayer.name} Is Offering
              </h3>
              <div className="space-y-1">
                {incomingOfferProperties.map((property) => (
                  <div
                    key={property!.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5"
                  >
                    <div
                      className={`w-2 h-2 rounded-sm flex-shrink-0 ${GROUP_STRIPE[property!.group!]}`}
                    />
                    <span className="text-sm text-white/80">
                      {property!.name}
                    </span>
                    <span className="text-xs text-white/40 ml-auto">
                      ${property!.price}
                    </span>
                  </div>
                ))}
                {incomingOfferProperties.length === 0 && (
                  <div className="text-xs text-white/40 italic">
                    No properties
                  </div>
                )}
              </div>
              {(incomingTrade?.offer.money ?? 0) > 0 && (
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5">
                  <span className="text-sm text-white/70">Cash</span>
                  <span className="text-sm font-bold text-green-400">
                    ${incomingTrade!.offer.money.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10" />

            {/* What they want */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                They Want in Return
              </h3>
              <div className="space-y-1">
                {incomingRequestProperties.map((property) => (
                  <div
                    key={property!.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5"
                  >
                    <div
                      className={`w-2 h-2 rounded-sm flex-shrink-0 ${GROUP_STRIPE[property!.group!]}`}
                    />
                    <span className="text-sm text-white/80">
                      {property!.name}
                    </span>
                    <span className="text-xs text-white/40 ml-auto">
                      ${property!.price}
                    </span>
                  </div>
                ))}
                {incomingRequestProperties.length === 0 && (
                  <div className="text-xs text-white/40 italic">
                    No properties
                  </div>
                )}
              </div>
              {(incomingTrade?.request.money ?? 0) > 0 && (
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5">
                  <span className="text-sm text-white/70">Cash</span>
                  <span className="text-sm font-bold text-red-400">
                    ${incomingTrade!.request.money.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Accept / Counter / Decline */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors font-semibold text-sm"
              >
                Decline
              </button>
              <button
                onClick={handleCounter}
                className="flex-1 py-2.5 rounded-xl border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 transition-colors font-semibold text-sm"
              >
                Counter
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 rounded-xl border border-green-500/40 bg-green-600/80 text-white hover:bg-green-500/90 transition-colors font-semibold text-sm"
              >
                Accept
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Your Offer Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
                {mode === "counter"
                  ? "Your Counter Offer"
                  : `What You're Offering`}
              </h3>

              {/* Properties Offered */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold">
                  Properties ({tradeOffer.offer.properties.length})
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {currentPlayerProperties.length > 0 ? (
                    currentPlayerProperties.map((property) => (
                      <label
                        key={property.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={tradeOffer.offer.properties.includes(
                            property.id,
                          )}
                          onChange={() =>
                            handleTogglePropertyOffered(property.id)
                          }
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-sm flex-shrink-0 ${GROUP_STRIPE[property!.group!]}`}
                            />
                            <div className="text-sm text-white">
                              {property.name}
                            </div>
                          </div>

                          <div className="text-xs text-white/40">
                            ${property.price}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-xs text-white/40 italic">
                      No properties owned
                    </div>
                  )}
                </div>
              </div>

              {/* Money Offered */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold">
                  Cash Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">$</span>
                  <input
                    type="number"
                    value={tradeOffer.offer.money}
                    onChange={(e) =>
                      setTradeOffer((prev) => ({
                        ...prev,
                        offer: {
                          ...prev.offer,
                          money: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      }))
                    }
                    max={currentPlayer.balance}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                    placeholder="0"
                  />
                  <span className="text-white/40 text-sm">
                    (Max: ${currentPlayer.balance})
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* What You Want Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                What You Want in Return
              </h3>

              {/* Properties Wanted */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold">
                  Properties ({tradeOffer.request.properties.length})
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {otherPlayerProperties.length > 0 ? (
                    otherPlayerProperties.map((property) => (
                      <label
                        key={property.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={tradeOffer.request.properties.includes(
                            property.id,
                          )}
                          onChange={() =>
                            handleTogglePropertyWanted(property.id)
                          }
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-sm flex-shrink-0 ${GROUP_STRIPE[property!.group!]}`}
                            />
                            <div className="text-sm text-white">
                              {property.name}
                            </div>
                          </div>
                          <div className="text-xs text-white/40">
                            ${property.price}
                          </div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-xs text-white/40 italic">
                      No properties owned
                    </div>
                  )}
                </div>
              </div>

              {/* Money Wanted */}
              <div className="space-y-2">
                <label className="text-xs text-white/60 font-semibold">
                  Cash Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white/60">$</span>
                  <input
                    type="number"
                    value={tradeOffer.request.money}
                    onChange={(e) =>
                      setTradeOffer((prev) => ({
                        ...prev,
                        request: {
                          ...prev.request,
                          money: Math.max(0, parseInt(e.target.value) || 0),
                        },
                      }))
                    }
                    max={tradeWithPlayer?.balance}
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/40"
                    placeholder="0"
                  />
                  <span className="text-white/40 text-sm">
                    (Max: ${tradeWithPlayer?.balance})
                  </span>
                </div>
              </div>
            </div>

            {/* Trade Summary */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10 space-y-2">
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Trade Summary
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Offering:</span>
                  <span className="text-yellow-300 font-semibold">
                    {tradeOffer.offer.properties.length} properties + $
                    {tradeOffer.offer.money}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Requesting:</span>
                  <span className="text-cyan-300 font-semibold">
                    {tradeOffer.request.properties.length} properties + $
                    {tradeOffer.request.money}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={
                  mode === "counter" ? () => setIsCountering(false) : close
                }
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors font-semibold"
              >
                {mode === "counter" ? "Back" : "Cancel"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  tradeOffer.offer.properties.length === 0 &&
                  tradeOffer.offer.money === 0
                }
                className="flex-1 py-2.5 rounded-xl border border-green-500/40 bg-green-600/80 text-white hover:bg-green-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {mode === "counter" ? "Send Counter" : "Send Offer"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
