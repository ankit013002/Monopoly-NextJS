"use client";

import { useState, useMemo } from "react";
import { GameStateType } from "@/app/types/GameStateType";
import { PlayerType } from "@/app/types/PlayerType";
import { FaTimes } from "react-icons/fa";

interface TradingModalProps {
  currentPlayer: PlayerType | null;
  tradeWithPlayer: PlayerType | null;
  gameId: number | null;
  gameState: GameStateType;
  setGameState: React.Dispatch<React.SetStateAction<GameStateType | null>>;
  setTradeWithPlayer: React.Dispatch<React.SetStateAction<PlayerType | null>>;
}

interface TradeOffer {
  propertiesOffered: string[];
  moneyOffered: number;
  propertiesWanted: string[];
  moneyWanted: number;
}

export default function TradingModal({
  currentPlayer,
  tradeWithPlayer,
  gameId,
  gameState,
  setGameState,
  setTradeWithPlayer,
}: TradingModalProps) {
  const [tradeOffer, setTradeOffer] = useState<TradeOffer>({
    propertiesOffered: [],
    moneyOffered: 0,
    propertiesWanted: [],
    moneyWanted: 0,
  });

  // Get properties owned by current player
  const currentPlayerProperties = useMemo(() => {
    if (!currentPlayer || !gameState.allProperties) return [];
    const allProps = Object.values(gameState.allProperties).flat();
    return allProps.filter(
      (prop) => prop.ownedBy?.socketId === currentPlayer.socketId,
    );
  }, [currentPlayer, gameState.allProperties]);

  // Get properties owned by other player
  const otherPlayerProperties = useMemo(() => {
    if (!tradeWithPlayer || !gameState.allProperties) return [];
    const allProps = Object.values(gameState.allProperties).flat();
    return allProps.filter(
      (prop) => prop.ownedBy?.socketId === tradeWithPlayer.socketId,
    );
  }, [tradeWithPlayer, gameState.allProperties]);

  const handleTogglePropertyOffered = (propertyId: string) => {
    setTradeOffer((prev) => ({
      ...prev,
      propertiesOffered: prev.propertiesOffered.includes(propertyId)
        ? prev.propertiesOffered.filter((id) => id !== propertyId)
        : [...prev.propertiesOffered, propertyId],
    }));
  };

  const handleTogglePropertyWanted = (propertyId: string) => {
    setTradeOffer((prev) => ({
      ...prev,
      propertiesWanted: prev.propertiesWanted.includes(propertyId)
        ? prev.propertiesWanted.filter((id) => id !== propertyId)
        : [...prev.propertiesWanted, propertyId],
    }));
  };

  const handleSubmit = () => {
    if (!currentPlayer || !tradeWithPlayer || gameId === null) return;

    // Emit trade offer to server
    const tradeData = {
      gameId,
      fromPlayerId: currentPlayer.socketId,
      toPlayerId: tradeWithPlayer?.socketId,
      offer: tradeOffer,
    };

    console.log("Trade offer:", tradeData);
    // TODO: Emit to socket or call API

    // Close modal
    setTradeWithPlayer(null);
  };

  const handleCancel = () => {
    setTradeWithPlayer(null);
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
            Trade Negotiation
          </div>
          <div className="text-sm font-semibold">
            {currentPlayer.name} ↔ {tradeWithPlayer.name}
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="text-white/50 hover:text-white transition-colors"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Your Offer Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-yellow-300 uppercase tracking-wider">
            {`What You're Offering`}
          </h3>

          {/* Properties Offered */}
          <div className="space-y-2">
            <label className="text-xs text-white/60 font-semibold">
              Properties ({tradeOffer.propertiesOffered.length})
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
                      checked={tradeOffer.propertiesOffered.includes(
                        property.id.toString(),
                      )}
                      onChange={() =>
                        handleTogglePropertyOffered(property.id.toString())
                      }
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm text-white">{property.name}</div>
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
                value={tradeOffer.moneyOffered}
                onChange={(e) =>
                  setTradeOffer((prev) => ({
                    ...prev,
                    moneyOffered: Math.max(0, parseInt(e.target.value) || 0),
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
              Properties ({tradeOffer.propertiesWanted.length})
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
                      checked={tradeOffer.propertiesWanted.includes(
                        property.id.toString(),
                      )}
                      onChange={() =>
                        handleTogglePropertyWanted(property.id.toString())
                      }
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="text-sm text-white">{property.name}</div>
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
                value={tradeOffer.moneyWanted}
                onChange={(e) =>
                  setTradeOffer((prev) => ({
                    ...prev,
                    moneyWanted: Math.max(0, parseInt(e.target.value) || 0),
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
                {tradeOffer.propertiesOffered.length} properties + $
                {tradeOffer.moneyOffered}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Requesting:</span>
              <span className="text-cyan-300 font-semibold">
                {tradeOffer.propertiesWanted.length} properties + $
                {tradeOffer.moneyWanted}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 hover:bg-white/5 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              tradeOffer.propertiesOffered.length === 0 &&
              tradeOffer.moneyOffered === 0
            }
            className="flex-1 py-2.5 rounded-xl border border-green-500/40 bg-green-600/80 text-white hover:bg-green-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
}
