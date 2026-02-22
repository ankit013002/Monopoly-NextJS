import { AllPropertiesType, SpaceType } from "../types/SpaceType";
import { CORNERS_ARRAY } from "./Corners";

export const BOTTOM_PROPERTIES: SpaceType[] = [
  {
    id: 9,
    name: "Connecticut Ave",
    type: "property",
    group: "lightBlue",
    price: 120,
  },
  {
    id: 8,
    name: "Vermont Ave",
    type: "property",
    group: "lightBlue",
    price: 100,
  },
  { id: 7, name: "Chance", type: "chance", icon: "?" },
  {
    id: 6,
    name: "Oriental Ave",
    type: "property",
    group: "lightBlue",
    price: 100,
  },
  {
    id: 5,
    name: "Reading Railroad",
    type: "railroad",
    icon: "🚂",
    price: 200,
  },
  { id: 4, name: "Income Tax", type: "tax", icon: "💰", price: 200 },
  { id: 3, name: "Baltic Ave", type: "property", group: "brown", price: 60 },
  { id: 2, name: "Community Chest", type: "community", icon: "🎁" },
  {
    id: 1,
    name: "Mediterranean Ave",
    type: "property",
    group: "brown",
    price: 60,
  },
];

export const LEFT_PROPERTIES: SpaceType[] = [
  {
    id: 19,
    name: "New York Ave",
    type: "property",
    group: "orange",
    price: 200,
  },
  {
    id: 18,
    name: "Tennessee Ave",
    type: "property",
    group: "orange",
    price: 180,
  },
  { id: 17, name: "Community Chest", type: "community", icon: "🎁" },
  {
    id: 16,
    name: "St. James Pl",
    type: "property",
    group: "orange",
    price: 180,
  },
  {
    id: 15,
    name: "Pennsylvania RR",
    type: "railroad",
    icon: "🚂",
    price: 200,
  },
  {
    id: 14,
    name: "Virginia Ave",
    type: "property",
    group: "pink",
    price: 160,
  },
  {
    id: 13,
    name: "States Ave",
    type: "property",
    group: "pink",
    price: 140,
  },
  {
    id: 12,
    name: "Electric Company",
    type: "utility",
    icon: "💡",
    price: 150,
  },
  {
    id: 11,
    name: "St. Charles Pl",
    type: "property",
    group: "pink",
    price: 140,
  },
];

export const TOP_PROPERTIES: SpaceType[] = [
  {
    id: 21,
    name: "Kentucky Ave",
    type: "property",
    group: "red",
    price: 220,
  },
  { id: 22, name: "Chance", type: "chance", icon: "?" },
  {
    id: 23,
    name: "Indiana Ave",
    type: "property",
    group: "red",
    price: 220,
  },
  {
    id: 24,
    name: "Illinois Ave",
    type: "property",
    group: "red",
    price: 240,
  },
  {
    id: 25,
    name: "B. & O. Railroad",
    type: "railroad",
    icon: "🚂",
    price: 200,
  },
  {
    id: 26,
    name: "Atlantic Ave",
    type: "property",
    group: "yellow",
    price: 260,
  },
  {
    id: 27,
    name: "Ventnor Ave",
    type: "property",
    group: "yellow",
    price: 260,
  },
  { id: 28, name: "Water Works", type: "utility", icon: "🚰", price: 150 },
  {
    id: 29,
    name: "Marvin Gardens",
    type: "property",
    group: "yellow",
    price: 280,
  },
];

export const RIGHT_PROPERTIES: SpaceType[] = [
  {
    id: 31,
    name: "Pacific Ave",
    type: "property",
    group: "green",
    price: 300,
  },
  {
    id: 32,
    name: "N. Carolina Ave",
    type: "property",
    group: "green",
    price: 300,
  },
  { id: 33, name: "Community Chest", type: "community", icon: "🎁" },
  {
    id: 34,
    name: "Pennsylvania Ave",
    type: "property",
    group: "green",
    price: 320,
  },
  { id: 35, name: "Short Line", type: "railroad", icon: "🚂", price: 200 },
  { id: 36, name: "Chance", type: "chance", icon: "?" },
  {
    id: 37,
    name: "Park Place",
    type: "property",
    group: "darkBlue",
    price: 350,
  },
  { id: 38, name: "Luxury Tax", type: "tax", icon: "💎", price: 100 },
  {
    id: 39,
    name: "Boardwalk",
    type: "property",
    group: "darkBlue",
    price: 400,
  },
];

export const ALL_PROPERTIES: AllPropertiesType = {
  bottomProperties: BOTTOM_PROPERTIES,
  topProperties: TOP_PROPERTIES,
  leftProperties: LEFT_PROPERTIES,
  rightProperties: RIGHT_PROPERTIES,
  corners: CORNERS_ARRAY,
};
