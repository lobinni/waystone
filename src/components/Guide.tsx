"use client";

import { useRef } from "react";

/**
 * The Guide mascot: a friendly stack of three rounded stones with a small face, drawn as an inline SVG.
 * No raster asset, so it scales perfectly at any size and always renders immediately.
 * Tilts in 3D towards the pointer and floats gently.
 */
export default function Guide({
  size = 320,
  tilt = true,
  className = "",
  float = true,
  alt = "A friendly stack of three stones, the companion of this application",
}: {
  size?: number;
  tilt?: boolean;
  className?: string;
  float?: boolean;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !tilt) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.setProperty("--ry", `${x * 12}deg`);
    el.style.setProperty("--rx", `${-y * 8}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--ry", "0deg");
    ref.current?.style.setProperty("--rx", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`guide ${float ? "is-float" : ""} ${className}`}
      style={{ width: size }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={alt}
      role="img"
    >
      <div className="guide__glow" />
      <GuideSvg />
      <span className="guide__shadow" />
    </div>
  );
}

function GuideSvg() {
  return (
    <svg
      viewBox="0 0 200 320"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "auto" }}
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="100" cy="308" rx="52" ry="8" fill="#07110e" opacity="0.18" />

      {/* Bottom stone — teal */}
      <rect x="22" y="230" width="156" height="62" rx="31" fill="#35d5b4" />
      <rect x="38" y="244" width="68" height="10" rx="5" fill="#fff" opacity="0.32" />

      {/* Middle stone — dark ink */}
      <rect x="38" y="166" width="124" height="56" rx="28" fill="#07110e" />
      <rect x="52" y="180" width="52" height="9" rx="4.5" fill="#fff" opacity="0.22" />

      {/* Top stone — amber accent */}
      <rect x="54" y="108" width="92" height="50" rx="25" fill="#f0a74b" />
      <rect x="66" y="121" width="40" height="8" rx="4" fill="#fff" opacity="0.38" />

      {/* Face on middle stone */}
      {/* Left eye */}
      <circle cx="80" cy="196" r="5" fill="#35d5b4" />
      <circle cx="80" cy="196" r="2.5" fill="#07110e" />
      {/* Right eye */}
      <circle cx="120" cy="196" r="5" fill="#35d5b4" />
      <circle cx="120" cy="196" r="2.5" fill="#07110e" />
      {/* Smile */}
      <path d="M88 207 Q100 216 112 207" stroke="#35d5b4" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Spark / sparkle on top */}
      <g style={{ transformOrigin: "100px 70px", animation: "guideSpark 3.4s ease-in-out infinite" }}>
        <circle cx="100" cy="70" r="22" fill="#35d5b4" opacity="0.14" />
        <circle cx="100" cy="70" r="14" fill="#35d5b4" opacity="0.22" />
        <path
          d="M100 56 L103.5 66.5 L114 70 L103.5 73.5 L100 84 L96.5 73.5 L86 70 L96.5 66.5 Z"
          fill="#087f71"
        />
      </g>

      <style>{`
        @keyframes guideSpark {
          0%, 100% { transform: scale(0.9) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.1) rotate(18deg); opacity: 1; }
        }
      `}</style>
    </svg>
  );
}
