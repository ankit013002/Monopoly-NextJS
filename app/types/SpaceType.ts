import { Group } from "./GroupType";

type SpaceEnums =
  | "corner"
  | "property"
  | "railroad"
  | "utility"
  | "tax"
  | "chance"
  | "community"
  | "special";

export type SpaceType = {
  id: number;
  name: string;
  type: SpaceEnums;
  price?: number;
  group?: Group;
  icon?: string;
  ownedBy?: {
    socketId: string;
    name: string;
    color: string;
  };
};

export type AllPropertiesType = {
  bottomProperties: SpaceType[];
  topProperties: SpaceType[];
  leftProperties: SpaceType[];
  rightProperties: SpaceType[];
  corners: SpaceType[];
};
