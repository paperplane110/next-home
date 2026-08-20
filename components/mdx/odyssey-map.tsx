"use client";

import { cn } from "@/lib/utils";

export interface MapHighlight {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  active?: boolean;
}

export interface MapRoute {
  from: string;
  to: string;
  color?: string;
}

export interface OdysseyMapProps {
  highlights?: MapHighlight[];
  routes?: MapRoute[];
  activeId?: string;
}

export function OdysseyMap({
  highlights = [],
  routes = [],
  activeId,
}: OdysseyMapProps) {
  const viewBoxWidth = 1600;
  const viewBoxHeight = 1000;

  const highlightMap = new Map(
    highlights.map((h) => [h.id, h])
  );

  const getPointCoords = (id: string) => {
    const h = highlightMap.get(id);
    return h
      ? [
          (h.x / 100) * viewBoxWidth,
          (h.y / 100) * viewBoxHeight,
        ]
      : null;
  };

  return (
    <div
      className={cn(
        "sticky top-24 aspect-[16/10] w-full bg-cream-50 rounded-lg border overflow-hidden shadow-sm"
      )}
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="waterPattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 Q10 10 20 20 T40 20"
              fill="none"
              stroke="rgba(59, 130, 246, 0.08)"
              strokeWidth="1.5"
            />
          </pattern>
          <linearGradient id="italyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9d5bf" />
            <stop offset="100%" stopColor="#c9c4a8" />
          </linearGradient>
          <linearGradient id="greeceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9d5bf" />
            <stop offset="100%" stopColor="#c9c4a8" />
          </linearGradient>
          <linearGradient id="turkeyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9d5bf" />
            <stop offset="100%" stopColor="#c9c4a8" />
          </linearGradient>
          <linearGradient id="egyptGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9d5bf" />
            <stop offset="100%" stopColor="#c9c4a8" />
          </linearGradient>
          <linearGradient id="sicilyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9d5bf" />
            <stop offset="100%" stopColor="#c9c4a8" />
          </linearGradient>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#waterPattern)" />

        <path
          d="M620,180 Q580,200 560,260 Q540,320 550,380 Q540,420 560,460 Q570,490 600,510 Q610,520 600,550 Q590,580 600,610 Q605,640 620,660 Q640,680 660,685 Q690,690 720,680 Q750,660 770,620 Q780,580 775,540 Q770,500 780,460 Q790,420 780,380 Q770,340 760,300 Q750,260 730,230 Q710,200 680,190 Q650,180 620,180 Z"
          fill="url(#italyGradient)"
          stroke="#b8b296"
          strokeWidth="2"
          opacity="0.9"
        />

        <path
          d="M980,400 Q950,420 930,460 Q915,490 920,530 Q925,560 950,580 Q980,600 1020,605 Q1060,610 1100,595 Q1140,580 1160,550 Q1175,520 1170,485 Q1160,450 1130,430 Q1100,410 1060,402 Q1020,398 980,400 Z"
          fill="url(#greeceGradient)"
          stroke="#b8b296"
          strokeWidth="2"
          opacity="0.9"
        />

        <path
          d="M1150,380 Q1180,360 1230,355 Q1280,350 1340,360 Q1400,370 1450,390 Q1490,410 1510,445 Q1520,480 1510,515 Q1495,550 1470,575 Q1440,595 1390,600 Q1340,605 1280,595 Q1220,585 1180,560 Q1150,540 1135,505 Q1120,470 1125,435 Q1130,405 1150,380 Z"
          fill="url(#turkeyGradient)"
          stroke="#b8b296"
          strokeWidth="2"
          opacity="0.9"
        />

        <path
          d="M850,680 Q810,690 780,710 Q755,735 750,765 Q745,795 760,820 Q780,850 820,865 Q870,880 920,875 Q970,870 1010,855 Q1050,840 1070,810 Q1085,780 1075,750 Q1065,720 1040,700 Q1000,680 950,678 Q900,676 850,680 Z"
          fill="url(#egyptGradient)"
          stroke="#b8b296"
          strokeWidth="2"
          opacity="0.9"
        />

        <path
          d="M640,600 Q610,610 595,635 Q580,660 590,685 Q600,710 625,725 Q650,740 680,738 Q710,735 730,715 Q750,695 745,668 Q740,640 720,620 Q695,603 665,600 Q650,599 640,600 Z"
          fill="url(#sicilyGradient)"
          stroke="#b8b296"
          strokeWidth="2"
          opacity="0.9"
        />

        <ellipse cx="480" cy="280" rx="60" ry="45" fill="#d9d5bf" stroke="#b8b296" strokeWidth="2" opacity="0.9" />
        <ellipse cx="430" cy="380" rx="45" ry="32" fill="#d9d5bf" stroke="#b8b296" strokeWidth="2" opacity="0.9" />
        <ellipse cx="880" cy="480" rx="30" ry="22" fill="#d9d5bf" stroke="#b8b296" strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="910" cy="520" rx="25" ry="18" fill="#d9d5bf" stroke="#b8b296" strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="935" cy="495" rx="20" ry="15" fill="#d9d5bf" stroke="#b8b296" strokeWidth="1.5" opacity="0.9" />
        <ellipse cx="1080" cy="620" rx="35" ry="25" fill="#d9d5bf" stroke="#b8b296" strokeWidth="1.5" opacity="0.9" />

        {routes.map((route, index) => {
          const fromCoords = getPointCoords(route.from);
          const toCoords = getPointCoords(route.to);
          if (!fromCoords || !toCoords) return null;

          const midX = (fromCoords[0] + toCoords[0]) / 2;
          const midY = (fromCoords[1] + toCoords[1]) / 2;
          const dx = toCoords[0] - fromCoords[0];
          const dy = toCoords[1] - fromCoords[1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          const offsetX = -dy / dist * 40;
          const offsetY = dx / dist * 40;
          const ctrlX = midX + offsetX;
          const ctrlY = midY + offsetY;

          return (
            <path
              key={`route-${index}`}
              d={`M${fromCoords[0]},${fromCoords[1]} Q${ctrlX},${ctrlY} ${toCoords[0]},${toCoords[1]}`}
              fill="none"
              stroke={route.color || "#be185d"}
              strokeWidth="3"
              strokeDasharray="12 8"
              strokeLinecap="round"
              opacity="0.75"
            />
          );
        })}

        {highlights.map((highlight) => {
          const cx = (highlight.x / 100) * viewBoxWidth;
          const cy = (highlight.y / 100) * viewBoxHeight;
          const isActive = activeId === highlight.id || highlight.active;
          const fillColor = highlight.color || "#be185d";

          return (
            <g key={highlight.id} style={{ pointerEvents: "auto" }}>
              {isActive && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="18"
                  fill={fillColor}
                  opacity="0.2"
                  filter="url(#glow)"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? 9 : 6}
                fill={fillColor}
                stroke="white"
                strokeWidth={isActive ? 3 : 2}
                style={{
                  transition: "r 0.2s ease, stroke-width 0.2s ease",
                }}
              />
              <g transform={`translate(${cx + 14}, ${cy + 4})`}>
                <rect
                  x="0"
                  y="-14"
                  width={highlight.label.length * 9 + 20}
                  height="24"
                  rx="6"
                  fill="white"
                  stroke="#d9d5bf"
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x="10"
                  y="3"
                  fontSize="13"
                  fontFamily="var(--font-serif), serif"
                  fill={isActive ? "var(--color-pink-700)" : "#4c472e"}
                  fontWeight={isActive ? "700" : "400"}
                  style={{
                    transition: "fill 0.2s ease, font-weight 0.2s ease",
                  }}
                >
                  {highlight.label}
                </text>
              </g>
            </g>
          );
        })}

        <g transform={`translate(${viewBoxWidth / 2}, ${viewBoxHeight - 45})`}>
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontSize="22"
            fontFamily="var(--font-serif), serif"
            fontStyle="italic"
            fill="#78716c"
            opacity="0.8"
          >
            Odysseus' Journey Map
          </text>
        </g>
      </svg>
    </div>
  );
}

export default OdysseyMap;
