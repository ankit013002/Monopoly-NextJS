import { PlayerType } from "./PlayerType";
import { SpaceType } from "./SpaceType";

export type GameStateType = {
  playerTurnId: number;
  properties: SpaceType[];
  players: PlayerType[];
};
