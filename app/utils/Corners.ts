import { SpaceType } from "../types/SpaceType";

export const corners = {
  topLeft: {
    id: 20,
    name: "FREE PARKING",
    type: "corner",
    icon: "🅿️",
  } as SpaceType,
  topRight: {
    id: 30,
    name: "GO TO JAIL",
    type: "corner",
    icon: "👉🚓",
  } as SpaceType,
  bottomLeft: {
    id: 10,
    name: "JAIL / JUST VISITING",
    type: "corner",
    icon: "⛓️",
  } as SpaceType,
  bottomRight: {
    id: 0,
    name: "GO",
    type: "corner",
    icon: "➡️",
    price: "Collect $200",
  } as SpaceType,
};

export const cornersArray = [
  corners.topLeft,
  corners.topRight,
  corners.bottomLeft,
  corners.bottomRight,
];
