'use client';
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  border?: string;
  className?: string;
}

export function Badge({ children, color, bg, border, className = '' }: BadgeProps) {
  const style: React.CSSProperties = {};
  if (color)  style.color       = color;
  if (bg)     style.backgroundColor = bg;
  if (border) style.borderColor = border;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
