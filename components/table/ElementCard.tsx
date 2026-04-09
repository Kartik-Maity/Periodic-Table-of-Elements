'use client';
import React from 'react';
import type { Element } from '@/data/elements.schema';
import { CATEGORY_INFO } from '@/data/elements.schema';

interface ElementCardProps {
  element: Element;
  isSelected?: boolean;
  isDimmed?: boolean;
  onClick?: (el: Element) => void;
  size?: 'sm' | 'md' | 'lg';
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent, el: Element) => void;
}

export function ElementCard({
  element,
  isSelected = false,
  isDimmed = false,
  onClick,
  size = 'md',
  tabIndex = 0,
  onKeyDown,
}: ElementCardProps) {
  const info = CATEGORY_INFO[element.category];

  const handleClick = () => onClick?.(element);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(element);
    }
    onKeyDown?.(e, element);
  };

  const stateIcon =
    element.state === 'gas'     ? '💨' :
    element.state === 'liquid'  ? '💧' :
    element.state === 'solid'   ? '' : '❓';

  const sizeClasses = {
    sm: 'text-[7px]',
    md: 'text-[8px]',
    lg: 'text-[9px]',
  };

  const symbolSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div
      role="button"
      tabIndex={isDimmed ? -1 : tabIndex}
      aria-label={`${element.name}, symbol ${element.symbol}, atomic number ${element.atomicNumber}, ${element.category.replace(/-/g, ' ')}`}
      aria-pressed={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`element-card select-none ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
      style={{
        backgroundColor: info.bg,
        borderColor: isSelected ? 'var(--accent)' : info.border,
        color: info.text,
      }}
      data-element={element.symbol}
    >
      {/* Atomic Number */}
      <div className={`self-start ${sizeClasses[size]} font-medium leading-none opacity-80`}>
        {element.atomicNumber}
      </div>

      {/* Symbol */}
      <div className={`${symbolSize[size]} font-bold leading-none tracking-tight`}>
        {element.symbol}
      </div>

      {/* Name + Mass row */}
      <div className="w-full flex flex-col items-center gap-0">
        <div
          className={`${sizeClasses[size]} w-full text-center leading-none truncate font-medium opacity-90`}
          style={{ maxWidth: '100%' }}
        >
          {element.name}
        </div>
        <div className={`${sizeClasses[size]} leading-none opacity-70`}>
          {element.atomicMass.toFixed(element.atomicMass < 100 ? 3 : 2)}
        </div>
      </div>

      {/* State icon — only on lg */}
      {size === 'lg' && stateIcon && (
        <div className="absolute top-1 right-1 text-[8px] leading-none opacity-60">
          {stateIcon}
        </div>
      )}
    </div>
  );
}
