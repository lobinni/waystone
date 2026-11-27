"use client";

import { useMemo, useState } from "react";

interface Props {
  stones?: number;
  className?: string;
  interactive?: boolean;
}

const TONES = ["#35d5b4", "#087f71", "#dff3eb", "#07110e", "#f0a74b", "#e7ece6", "#65706b"];

/**
 * The stack preview: one flat stone per round, drawn as SVG. Pointer movement leans the stack, and every stone
 * keeps its own tone so a stack of many rounds still reads at a glance. No WebGL, no external asset.
 */
export default function StoneScene({ stones = 5, className = "", interactive = true }: Props) {
  const n = Math.max(1, Math.min(14, Math.round(stones)));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const rows = useMemo(() => {
    const h = 100 / (n * 1.55);
    return Array.from({ length: n }, (_, i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      return { i, y: 96 - (i + 1) * h * 1.5, h: h * 1.18, w: 74 - t * 40, tone: TONES[i % TONES.length] };
    });
  }, [n]);

  return (
    <div
      className={`stonescene ${className}`}
      onPointerMove={
        interactive
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTilt({
                x: ((e.clientX - r.left) / r.width - 0.5) * 14,
                y: ((e.clientY - r.top) / r.height - 0.5) * 10,
              });
            }
          : undefined
      }
      onPointerLeave={interactive ? () => setTilt({ x: 0, y: 0 }) : undefined}
      aria-hidden="true"
    >
      <div className="stonescene__halo" />
      <svg viewBox="0 0 100 104" role="presentation" style={{ transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)` }}>
        <ellipse cx="50" cy="99" rx="34" ry="4" className="stonescene__ground" />
        {rows.map(({ i, y, h, w, tone }) => (
          <g key={i} className="stonescene__stone" style={{ animationDelay: `${i * 90}ms` }}>
            <rect x={(100 - w) / 2} y={y} width={w} height={h} rx={h / 2} fill={tone} />
            <rect
              x={(100 - w) / 2 + w * 0.16}
              y={y + h * 0.24}
              width={w * 0.3}
              height={Math.max(1.2, h * 0.14)}
              rx={h * 0.07}
              fill="#ffffff"
              opacity="0.55"
            />
          </g>
        ))}
        <g className="stonescene__spark">
          <circle cx="50" cy="8" r="9" fill="#35d5b4" opacity="0.16" />
          <path d="M50 2.5l1.9 4.6 4.6 1.9-4.6 1.9L50 15.5l-1.9-4.6-4.6-1.9 4.6-1.9Z" fill="#087f71" />
        </g>
      </svg>
    </div>
  );
}
