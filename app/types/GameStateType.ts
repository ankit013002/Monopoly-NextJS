import { PlayerType } from "./PlayerType";

export type GameStateType = {
  playerCount: number;
  playerTurnIndex: number;
  players: PlayerType[];
};
