'use client';
import React, { useEffect, useRef } from 'react';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';

interface ElectronVisualizerProps {
  element: Element;
}

export function ElectronVisualizer({ element }: ElectronVisualizerProps) {
  const { electronShells } = element;
  const info = CATEGORY_INFO[element.category];
  const animRef = useRef<boolean>(false);

  const SIZE = 200;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const NUCLEUS_R = 16;
  const SHELL_STEP = (SIZE / 2 - NUCLEUS_R - 12) / Math.max(electronShells.length, 1);
  const ELECTRON_R = 3.5;

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Electron shell diagram for ${element.name}`}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="overflow-visible"
        role="img"
        aria-hidden="true"
      >
        {/* Shells */}
        {electronShells.map((count, shellIdx) => {
          const r = NUCLEUS_R + (shellIdx + 1) * SHELL_STEP;
          const electrons = Array.from({ length: count }, (_, eIdx) => {
            const angle = (2 * Math.PI * eIdx) / count - Math.PI / 2;
            const x = CX + r * Math.cos(angle);
            const y = CY + r * Math.sin(angle);
            return { x, y, angle };
          });

          return (
            <g key={shellIdx}>
              {/* Shell ring */}
              <circle
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke={info.border}
                strokeWidth="1"
                opacity="0.6"
              />
              {/* Electrons */}
              {electrons.map((e, eIdx) => (
                <circle
                  key={eIdx}
                  cx={e.x}
                  cy={e.y}
                  r={ELECTRON_R}
                  fill={info.text}
                  opacity="0.9"
                  style={
                    !prefersReducedMotion
                      ? {
                          animation: `spin-slow ${4 + shellIdx * 2}s linear infinite`,
                          transformOrigin: `${CX}px ${CY}px`,
                          animationDelay: `${eIdx * 0.1}s`,
                        }
                      : {}
                  }
                />
              ))}
            </g>
          );
        })}

        {/* Nucleus */}
        <circle cx={CX} cy={CY} r={NUCLEUS_R} fill={info.text} opacity="0.95" />
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={electronShells.length > 5 ? 7 : 8}
          fontWeight="bold"
          fontFamily="var(--font-sans)"
        >
          {element.symbol}
        </text>
      </svg>

      {/* Shell labels */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {electronShells.map((count, i) => (
          <div key={i} className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">
              Shell {i + 1}:
            </span>
            <span>{count}e⁻</span>
          </div>
        ))}
      </div>
    </div>
  );
}
