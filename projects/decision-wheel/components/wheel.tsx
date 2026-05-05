"use client";

// SVG wheel. The parent owns rotation in absolute degrees; the wheel just
// renders slices and applies the rotation via a CSS transform with optional
// transition (driven by the parent's `spinning` flag and `duration`).
//
// Slice 0 starts at the top (12 o'clock) and slices proceed clockwise.
// The pointer is rendered above the SVG and points DOWN into the wheel,
// so whichever slice rests at the top after a spin is the chosen one.

import { cn } from "@/lib/cn";

import type { WheelItem } from "../data/types";

interface WheelProps {
  items: WheelItem[];
  /** Total accumulated rotation in degrees. */
  rotation: number;
  /** Whether the rotation transition is active. */
  spinning: boolean;
  /** Transition duration in ms. */
  duration: number;
  size?: number;
}

export function Wheel({
  items,
  rotation,
  spinning,
  duration,
  size = 320,
}: WheelProps) {
  if (items.length === 0) {
    return <EmptyWheel size={size} />;
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const sliceAngle = 360 / items.length;
  const colors: ("var(--accent)" | "var(--accent-dim)")[] = [
    "var(--accent)",
    "var(--accent-dim)",
  ];

  return (
    <div className="relative" style={{ height: size + 16, width: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="block select-none"
        width={size}
        height={size}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? `transform ${duration}ms cubic-bezier(.15, .85, .25, 1)`
            : "none",
        }}
        aria-hidden
      >
        {items.map((item, i) => {
          const start = i * sliceAngle;
          const end = (i + 1) * sliceAngle;
          const labelAngle = start + sliceAngle / 2;
          const labelRad = ((labelAngle - 90) * Math.PI) / 180;
          const labelR = r * 0.62;
          const labelX = cx + labelR * Math.cos(labelRad);
          const labelY = cy + labelR * Math.sin(labelRad);
          const fill = colors[i % colors.length];

          return (
            <g key={item.id}>
              <path
                d={wedgePath(cx, cy, r, start, end)}
                fill={fill}
                stroke="var(--bg)"
                strokeWidth={2}
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${labelAngle}, ${labelX}, ${labelY})`}
                fill="var(--accent-on)"
                style={{ pointerEvents: "none" }}
                fontFamily="var(--f-mono)"
                fontSize={items.length > 8 ? 9 : 11}
                fontWeight={700}
                letterSpacing="0.06em"
              >
                {truncate(item.text, items.length > 8 ? 10 : 14)}
              </text>
            </g>
          );
        })}
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.06}
          fill="var(--bg)"
          stroke="var(--accent)"
          strokeWidth={2}
        />
      </svg>

      {/* Pointer above the wheel, apex pointing down. */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2">
        <svg width="26" height="26" viewBox="0 0 24 24" className="drop-shadow-[0_2px_6px_rgba(0,0,0,.6)]">
          <path
            d="M12 19 L3 5 L21 5 Z"
            fill="var(--accent)"
            stroke="var(--bg)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function EmptyWheel({ size }: { size: number }) {
  return (
    <div
      className={cn(
        "grid place-items-center rounded-round border-2 border-dashed border-line-2 bg-surface/40",
      )}
      style={{ height: size, width: size }}
    >
      <div className="text-center">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-mute-3">
          // EMPTY
        </div>
        <p className="mt-2 max-w-[12rem] text-sm text-mute">
          Add a few things below to spin.
        </p>
      </div>
    </div>
  );
}

function wedgePath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const startRad = ((startDeg - 90) * Math.PI) / 180;
  const endRad = ((endDeg - 90) * Math.PI) / 180;
  const sx = cx + r * Math.cos(startRad);
  const sy = cy + r * Math.sin(startRad);
  const ex = cx + r * Math.cos(endRad);
  const ey = cy + r * Math.sin(endRad);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey} Z`;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, Math.max(1, max - 1)) + "…" : s;
}
