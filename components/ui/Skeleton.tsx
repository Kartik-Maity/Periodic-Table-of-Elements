'use client';
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-md)] bg-[var(--bg-tertiary)] ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function ElementCardSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] animate-pulse aspect-[5/6]">
      <Skeleton className="w-4 h-2 mb-auto" />
      <Skeleton className="w-8 h-5 mx-auto" />
      <Skeleton className="w-10 h-2 mx-auto mt-auto" />
    </div>
  );
}
