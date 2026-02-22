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
  ownedBy?: string;
};
