// app/utils/BoardLayout.ts
import { Edge } from "../types/EdgeType";
import { SpaceType } from "../types/SpaceType";
import { CORNERS } from "./Corners";
import {
  BOTTOM_PROPERTIES,
  LEFT_PROPERTIES,
  RIGHT_PROPERTIES,
  TOP_PROPERTIES,
} from "./Properties";

export type BoardCell = {
  pos: number; // 0..39
  space: SpaceType;
  edge: Edge;
  gridColumn: number;
  gridRow: number;
  colSpan: number;
  rowSpan: number;
};

const corner = (
  pos: number,
  space: SpaceType,
  gridColumn: number,
  gridRow: number
): BoardCell => ({
  pos,
  space,
  edge: "corner",
  gridColumn,
  gridRow,
  colSpan: 2,
  rowSpan: 2,
});

const topEdge = (pos: number, space: SpaceType, i: number): BoardCell => ({
  pos,
  space,
  edge: "top",
  gridColumn: 3 + i, // 3..11
  gridRow: 1,
  colSpan: 1,
  rowSpan: 2,
});

const bottomEdgeFromGo = (pos: number, space: SpaceType, i: number): BoardCell => ({
  pos,
  space,
  edge: "bottom",
  gridColumn: 11 - i, // 11..3 (GO -> Jail direction)
  gridRow: 12,
  colSpan: 1,
  rowSpan: 2,
});

const leftEdgeFromJailUp = (
  pos: number,
  space: SpaceType,
  i: number
): BoardCell => ({
  pos,
  space,
  edge: "left",
  gridColumn: 1,
  gridRow: 11 - i, // 11..3 (Jail -> Free Parking)
  colSpan: 2,
  rowSpan: 1,
});

const rightEdgeDown = (pos: number, space: SpaceType, i: number): BoardCell => ({
  pos,
  space,
  edge: "right",
  gridColumn: 12,
  gridRow: 3 + i, // 3..11 (Go To Jail -> GO)
  colSpan: 2,
  rowSpan: 1,
});

/**
 * Movement order (pos 0..39):
 * 0  = GO (bottom-right)
 * 1..9 = bottom edge from GO -> Jail (Mediterranean .. Connecticut)
 * 10 = Jail (bottom-left)
 * 11..19 = left edge up -> Free Parking
 * 20 = Free Parking (top-left)
 * 21..29 = top edge left->right
 * 30 = Go To Jail (top-right)
 * 31..39 = right edge down -> GO
 */
export const BOARD_CELLS: BoardCell[] = (() => {
  const cells: BoardCell[] = [];

  // 0: GO
  cells.push(corner(0, CORNERS.bottomRight, 12, 12));

  // 1..9: bottom edge from GO moving toward Jail (reverse your render order)
  const bottomFromGo = [...BOTTOM_PROPERTIES].reverse(); // Mediterranean -> Connecticut
  bottomFromGo.forEach((space, i) => {
    cells.push(bottomEdgeFromGo(1 + i, space, i));
  });

  // 10: Jail
  cells.push(corner(10, CORNERS.bottomLeft, 1, 12));

  // 11..19: left edge from Jail going up (reverse your render order)
  const leftFromJailUp = [...LEFT_PROPERTIES].reverse(); // St Charles -> New York
  leftFromJailUp.forEach((space, i) => {
    cells.push(leftEdgeFromJailUp(11 + i, space, i));
  });

  // 20: Free Parking
  cells.push(corner(20, CORNERS.topLeft, 1, 1));

  // 21..29: top edge left->right (your array already in that order)
  TOP_PROPERTIES.forEach((SpaceEnums, i) => {
    cells.push(topEdge(21 + i, SpaceEnums, i));
  });

  // 30: Go To Jail
  cells.push(corner(30, CORNERS.topRight, 12, 1));

  // 31..39: right edge top->bottom (your array already in that order)
  RIGHT_PROPERTIES.forEach((space, i) => {
    cells.push(rightEdgeDown(31 + i, space, i));
  });

  // Safety: should be exactly 40
  return cells;
})();

export const BOARD_LEN = BOARD_CELLS.length; // 40
