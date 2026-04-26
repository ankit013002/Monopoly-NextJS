import { lastRollType } from "./lastRollType";
import { PlayerType } from "./PlayerType";
import { AllSpacesType } from "./SpaceType";

export type GameStateType = {
  playerCount: number;
  playerTurnIndex: number;
  allSpaces: AllSpacesType;
  lastRoll: lastRollType;
  players: PlayerType[];
};
