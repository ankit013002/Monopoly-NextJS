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
  price?: string;
  group?: Group;
  icon?: string;
  ownedBy?: number;
};
