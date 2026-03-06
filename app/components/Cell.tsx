import React from "react";
import { Edge } from "../types/EdgeType";
import { Group } from "../types/GroupType";
import { SpaceType } from "../types/SpaceType";
import { GROUP_STRIPE } from "../utils/Groups";

// ─── SVG icons ──────────────────────────────────────────────────────────────

function IconArrow({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconBars({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="2" width="2.5" height="14" rx="0.5" />
      <rect x="8" y="2" width="2.5" height="14" rx="0.5" />
      <rect x="13" y="2" width="2.5" height="14" rx="0.5" />
      <rect x="18" y="2" width="2.5" height="14" rx="0.5" />
      <rect x="2" y="5" width="20" height="2" rx="0.5" />
      <rect x="2" y="12" width="20" height="2" rx="0.5" />
      <text
        x="12"
        y="23"
        fontSize="6"
        textAnchor="middle"
        fontWeight="bold"
        fill="currentColor"
      >
        JAIL
      </text>
    </svg>
  );
}

function IconParking({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 7h4.5a3 3 0 0 1 0 6H9V7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHandcuffs({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <circle cx="7" cy="14" r="4" />
      <circle cx="17" cy="14" r="4" />
      <path d="M11 14h2" />
      <path d="M7 10V7m4-2h-2a2 2 0 0 0-2 2v1M17 10V7m-4-2h2a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconTrain({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="12" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 4v7" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="16" cy="19" r="2" />
      <path d="M6 16l-2 3M18 16l2 3" />
    </svg>
  );
}

function IconBolt({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconDrop({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function IconChest({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M2 12h20" />
      <path d="M9 12v3a3 3 0 0 0 6 0v-3" />
    </svg>
  );
}

function IconQuestion({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  );
}

function IconDiamond({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l10 9-10 11L2 11z" />
    </svg>
  );
}

function IconDollar({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// ─── Stripe ─────────────────────────────────────────────────────────────────

/**
 * Renders as a flex child that takes up the stripe portion.
 * Using flex-based layout means the stripe size is proportional to the cell.
 */
function Stripe({ edge, group }: { edge: Edge; group: Group }) {
  const colorClass = GROUP_STRIPE[group];
  const isHorizontal = edge === "top" || edge === "bottom";

  return (
    <div
      className={`shrink-0 ${colorClass}`}
      style={{
        // Stripe is ~28% of the cell's dominant dimension
        width: isHorizontal ? "100%" : "28%",
        height: isHorizontal ? "28%" : "100%",
        boxShadow: isHorizontal
          ? edge === "top"
            ? "inset 0 -1px 2px rgba(0,0,0,0.12)"
            : "inset 0 1px 2px rgba(0,0,0,0.12)"
          : edge === "left"
            ? "inset -1px 0 2px rgba(0,0,0,0.12)"
            : "inset 1px 0 2px rgba(0,0,0,0.12)",
      }}
    />
  );
}

// ─── Property / edge cell content ───────────────────────────────────────────

function EdgeContent({ space, edge }: { space: SpaceType; edge: Edge }) {
  const isRR = space.type === "railroad";
  const isUtil = space.type === "utility";
  const isDeck = space.type === "chance" || space.type === "community";
  const isTax = space.type === "tax";

  // Pick SVG icon based on space type / name
  const icon = isRR ? (
    <IconTrain size={12} />
  ) : isUtil && space.name.toLowerCase().includes("water") ? (
    <IconDrop size={10} />
  ) : isUtil ? (
    <IconBolt size={10} />
  ) : space.type === "chance" ? (
    <IconQuestion size={10} />
  ) : space.type === "community" ? (
    <IconChest size={10} />
  ) : isTax && space.name.toLowerCase().includes("luxury") ? (
    <IconDiamond size={9} />
  ) : isTax ? (
    <IconDollar size={9} />
  ) : null;

  const isHorizontal = edge === "top" || edge === "bottom";
  const textSize = "10.5px";
  const priceSize = "7px";

  if (isHorizontal) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center overflow-hidden"
        style={{ padding: "1px 2px", gap: "1px" }}
      >
        {icon && (
          <div className="text-black/50 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div
          className="font-bold text-black/90 text-center leading-tight w-full"
          style={{
            fontSize: textSize,
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {space.name}
        </div>
        {space.price != null && (
          <div
            className="font-semibold text-center"
            style={{ fontSize: priceSize, color: "#145a14" }}
          >
            ${space.price}
          </div>
        )}
        {isDeck && (
          <div
            className="font-semibold text-black/40 text-center"
            style={{ fontSize: priceSize }}
          >
            DRAW
          </div>
        )}
        {isTax && !space.price && (
          <div
            className="font-semibold text-black/40 text-center"
            style={{ fontSize: priceSize }}
          >
            PAY
          </div>
        )}
      </div>
    );
  }

  // Landscape (left/right) — horizontal flow: stripe | content
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center overflow-hidden"
      style={{ padding: "1px 2px", gap: "1px" }}
    >
      {icon && (
        <div className="text-black/50 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div
        className="font-bold text-black/90 text-center leading-tight w-full"
        style={{ fontSize: textSize, wordBreak: "break-word", hyphens: "auto" }}
      >
        {space.name}
      </div>
      {space.price != null && (
        <div
          className="font-semibold text-center"
          style={{ fontSize: priceSize, color: "#145a14" }}
        >
          ${space.price}
        </div>
      )}
      {isDeck && (
        <div
          className="font-semibold text-black/40 text-center"
          style={{ fontSize: priceSize }}
        >
          DRAW
        </div>
      )}
    </div>
  );
}

// ─── Corner cells ────────────────────────────────────────────────────────────

function CornerContent({ space }: { space: SpaceType }) {
  if (space.id === 0) {
    // GO
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1"
        style={{
          background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)",
        }}
      >
        <div
          className="text-black/35 font-bold uppercase tracking-widest"
          style={{ fontSize: "6px" }}
        >
          Collect
        </div>
        <div
          className="font-black text-black/80 tracking-tight"
          style={{ fontSize: "22px", lineHeight: 1 }}
        >
          GO
        </div>
        <div className="text-black/50 font-bold" style={{ fontSize: "7px" }}>
          $200 salary
        </div>
        <div className="rotate-180 mt-1 text-black/60">
          <IconArrow size={18} />
        </div>
      </div>
    );
  }

  if (space.id === 10) {
    // Jail / Just Visiting
    return (
      <div
        className="w-full h-full relative overflow-hidden"
        style={{ background: "#f5f0e0" }}
      >
        {/* Diagonal divider */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #f5c842 0%, #f5c842 48%, transparent 50%, transparent 100%)",
            opacity: 0.15,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1.5">
          <div className="text-black/60">
            <IconBars size={22} />
          </div>
          <div
            className="font-black text-black/75 text-center leading-tight"
            style={{ fontSize: "8px" }}
          >
            JAIL
          </div>
          <div
            className="font-semibold text-black/40 text-center"
            style={{ fontSize: "8.5px" }}
          >
            Just Visiting
          </div>
        </div>
      </div>
    );
  }

  if (space.id === 20) {
    // Free Parking
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-1 p-1.5"
        style={{
          background: "linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)",
        }}
      >
        <div className="text-black/60">
          <IconParking size={22} />
        </div>
        <div
          className="font-black text-black/75 text-center leading-tight"
          style={{ fontSize: "7px" }}
        >
          FREE
        </div>
        <div
          className="font-black text-black/75 text-center leading-tight"
          style={{ fontSize: "7px" }}
        >
          PARKING
        </div>
      </div>
    );
  }

  if (space.id === 30) {
    // Go To Jail
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-1 p-1.5"
        style={{
          background: "linear-gradient(135deg, #fce4ec 0%, #fff0f3 100%)",
        }}
      >
        <div className="text-black/60">
          <IconHandcuffs size={20} />
        </div>
        <div
          className="font-black text-black/75 text-center leading-tight"
          style={{ fontSize: "7px" }}
        >
          GO TO
        </div>
        <div
          className="font-black text-black/75 text-center leading-tight"
          style={{ fontSize: "7px" }}
        >
          JAIL
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-1">
      <div
        className="font-black text-black/80 text-center"
        style={{ fontSize: "8px" }}
      >
        {space.name}
      </div>
    </div>
  );
}

// ─── Main Cell ───────────────────────────────────────────────────────────────

export function Cell({
  space,
  edge,
  gridColumn,
  gridRow,
  colSpan,
  rowSpan,
  isCorner = false,
}: {
  space: SpaceType;
  edge: Edge;
  gridColumn: number;
  gridRow: number;
  colSpan: number;
  rowSpan: number;
  isCorner?: boolean;
}) {
  const isProperty = space.type === "property" && space.group;
  const isLandscape = edge === "left" || edge === "right";

  const cellStyle: React.CSSProperties = {
    gridColumn: `${gridColumn} / span ${colSpan}`,
    gridRow: `${gridRow} / span ${rowSpan}`,
    border: "1px solid rgba(0,0,0,0.65)",
    backgroundColor: "#ffffff",
    position: "relative",
    overflow: "hidden",
  };

  // Owned-by dot (absolute, always on top)
  const ownedDot = space.ownedBy ? (
    <div
      style={{
        position: "absolute",
        top: "3px",
        right: "3px",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: space.ownedBy.color,
        border: "1px solid rgba(255,255,255,0.8)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
        zIndex: 20,
      }}
    />
  ) : null;

  if (isCorner) {
    return (
      <div style={cellStyle}>
        {ownedDot}
        <CornerContent space={space} />
      </div>
    );
  }

  // Edge cells: stripe + content in a flex row (landscape) or flex column (portrait)
  const flexDir =
    edge === "top"
      ? "column"
      : edge === "bottom"
        ? "column-reverse"
        : edge === "left"
          ? "row"
          : "row-reverse"; // right

  return (
    <div
      style={{
        ...cellStyle,
        display: "flex",
        flexDirection: flexDir as React.CSSProperties["flexDirection"],
      }}
    >
      {ownedDot}

      {/* Color stripe (only for property cells) */}
      {isProperty && <Stripe edge={edge} group={space.group!} />}

      {/* For non-property cells: full-width/height content */}
      {!isProperty && <EdgeContent space={space} edge={edge} />}

      {/* For property cells: content in remaining space */}
      {isProperty && (
        <div
          className="flex-1 flex flex-col items-center justify-center overflow-hidden"
          style={{
            padding: isLandscape ? "1px 3px" : "2px",
            gap: "1px",
          }}
        >
          <div
            className="font-bold text-black/90 text-center leading-tight w-full"
            style={{
              fontSize: "8.5px",
              wordBreak: "break-word",
              hyphens: "auto",
            }}
          >
            {space.name}
          </div>
          {space.price != null && (
            <div
              className="font-semibold text-center"
              style={{ fontSize: "7px", color: "#145a14" }}
            >
              ${space.price}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
