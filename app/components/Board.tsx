import { GameStateType } from "../types/GameStateType";
import { BOARD_CELLS } from "../utils/BoardLayout";
import { CORNERS } from "../utils/Corners";
import BoardCenter from "./BoardCenter";
import { Cell } from "./Cell";
import TokensLayer from "./TokensLayer";

interface BoardProps {
  gameState: GameStateType;
}

export const Board = ({ gameState }: BoardProps) => {
  return (
    <div
      className="w-[min(92vw,92vh)] max-w-245 aspect-square"
      style={{
        filter:
          "drop-shadow(0 8px 32px rgba(0,0,0,0.55)) drop-shadow(0 2px 8px rgba(0,0,0,0.35))",
      }}
    >
      <div
        className="h-full w-full"
        style={{
          border: "4px solid #111",
          background: "#fdfcf7",
          boxShadow: "inset 0 0 0 2px #555, inset 0 0 0 4px #f5edde",
        }}
      >
        <div className="relative grid h-full w-full grid-cols-13 grid-rows-13">
          {/* Corners (2x2) */}
          <Cell
            space={CORNERS.topLeft}
            edge="corner"
            isCorner
            gridColumn={1}
            gridRow={1}
            colSpan={2}
            rowSpan={2}
          />
          <Cell
            space={CORNERS.topRight}
            edge="corner"
            isCorner
            gridColumn={12}
            gridRow={1}
            colSpan={2}
            rowSpan={2}
          />
          <Cell
            space={CORNERS.bottomLeft}
            edge="corner"
            isCorner
            gridColumn={1}
            gridRow={12}
            colSpan={2}
            rowSpan={2}
          />
          <Cell
            space={CORNERS.bottomRight}
            edge="corner"
            isCorner
            gridColumn={12}
            gridRow={12}
            colSpan={2}
            rowSpan={2}
          />

          {/* Top edge (row 1-2, col 3-11) left->right */}
          {gameState.allProperties.topProperties.map((space, i) => (
            <Cell
              key={`top-${i}`}
              space={space}
              edge="top"
              gridColumn={3 + i}
              gridRow={1}
              colSpan={1}
              rowSpan={2}
            />
          ))}

          {/* Bottom edge (row 12-13, col 3-11) left->right */}
          {gameState.allProperties.bottomProperties.map((space, i) => (
            <Cell
              key={`bottom-${i}`}
              space={space}
              edge="bottom"
              gridColumn={3 + i}
              gridRow={12}
              colSpan={1}
              rowSpan={2}
            />
          ))}

          {/* Left edge (col 1-2, row 3-11) top->bottom */}
          {gameState.allProperties.leftProperties.map((space, i) => (
            <Cell
              key={`left-${i}`}
              space={space}
              edge="left"
              gridColumn={1}
              gridRow={3 + i}
              colSpan={2}
              rowSpan={1}
            />
          ))}

          {/* Right edge (col 12-13, row 3-11) top->bottom */}
          {gameState.allProperties.rightProperties.map((space, i) => (
            <Cell
              key={`right-${i}`}
              space={space}
              edge="right"
              gridColumn={12}
              gridRow={3 + i}
              colSpan={2}
              rowSpan={1}
            />
          ))}

          {/* Center (9x9) + HUD */}
          <BoardCenter />

          {/* Tokens overlay (on top of cells) */}
          <TokensLayer tokens={gameState.players} board={BOARD_CELLS} />
        </div>
      </div>
    </div>
  );
};
