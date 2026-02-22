import { Edge } from "../types/EdgeType";
import { Group } from "../types/GroupType";
import { SpaceType } from "../types/SpaceType";
import { GROUP_STRIPE } from "../utils/Groups";

function Stripe({ edge, group }: { edge: Edge; group: Group }) {
  const base = `absolute ${GROUP_STRIPE[group]}`;
  if (edge === "top")
    return <div className={`${base} left-0 right-0 top-0 h-3`} />;
  if (edge === "bottom")
    return <div className={`${base} left-0 right-0 bottom-0 h-3`} />;
  if (edge === "left")
    return <div className={`${base} left-0 top-0 bottom-0 w-3`} />;
  if (edge === "right")
    return <div className={`${base} right-0 top-0 bottom-0 w-3`} />;
  return null;
}

export function Cell({
  space,
  edge,
  rotate = 0,
  gridColumn,
  gridRow,
  colSpan,
  rowSpan,
  isCorner = false,
}: {
  space: SpaceType;
  edge: Edge;
  rotate?: 0 | 90 | 180 | -90;
  gridColumn: number;
  gridRow: number;
  colSpan: number;
  rowSpan: number;
  isCorner?: boolean;
}) {
  const isProperty = space.type === "property" && space.group;
  const isDeck = space.type === "chance" || space.type === "community";
  const isTax = space.type === "tax";
  const isRR = space.type === "railroad";
  const isUtil = space.type === "utility";
  console.log(space.ownedBy?.color);
  return (
    <div
      className={`relative border  border-black/40 ${space.ownedBy ? `bg-${space.ownedBy.color}` : "bg-white/80"}`}
      style={{
        gridColumn: `${gridColumn} / span ${colSpan}`,
        gridRow: `${gridRow} / span ${rowSpan}`,
      }}
    >
      {isProperty && <Stripe edge={edge} group={space.group!} />}

      <div className="absolute inset-0 p-1">
        <div
          className={`h-full w-full ${
            isCorner ? "p-2" : "p-1"
          } flex flex-col items-center justify-between text-center`}
          style={{
            transformOrigin: "center",
          }}
        >
          {/* Top line / icon */}
          <div className="w-full flex items-center justify-center gap-1">
            {space.icon && (
              <span className={isCorner ? "text-lg" : "text-sm"}>
                {space.icon}
              </span>
            )}
          </div>

          {/* Name */}
          <div
            className={`leading-tight font-semibold text-black ${
              rotate && `rotate(90deg)`
            } text-[7px]`}
          >
            {space.name}
          </div>

          {/* Bottom line */}
          <div className="w-full flex items-center justify-center text-black">
            <div
              className={`leading-none ${
                isCorner ? "text-xs md:text-xs" : "text-[10px]"
              } font-medium`}
            >
              {space.price
                ? space.price
                : isDeck
                  ? "DRAW"
                  : isTax
                    ? "PAY"
                    : isRR
                      ? "RR"
                      : isUtil
                        ? "UTIL"
                        : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
