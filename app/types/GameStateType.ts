import { lastRollType } from "./lastRollType";
import { PlayerType } from "./PlayerType";
import { AllPropertiesType } from "./SpaceType";

export type GameStateType = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: AllPropertiesType;
  lastRoll: lastRollType;
  players: PlayerType[];
};
