import { PlayerType } from "./PlayerType";
import { SpaceType } from "./SpaceType";

export type GameStateType = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: SpaceType[];
  players: PlayerType[];
};
