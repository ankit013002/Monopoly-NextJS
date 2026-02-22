import { PlayerType } from "./PlayerType";
import { AllPropertiesType, SpaceType } from "./SpaceType";

export type GameStateType = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: AllPropertiesType;
  players: PlayerType[];
};
