'use client';
import React from 'react';
import { PeriodicTable } from '@/components/table/PeriodicTable';
import { CategoryLegend } from '@/components/table/CategoryLegend';
import { TableControls } from '@/components/table/TableControls';
import { ElementPanel } from '@/components/detail/ElementPanel';
import { FilterPanel } from '@/components/filter/FilterPanel';
import { FilterChips } from '@/components/filter/FilterChips';
import { useUIStore } from '@/store/uiStore';
import { useFilterStore } from '@/store/filterStore';

export function HomeClient() {
  const { selectedElement } = useUIStore();
  const { isOpen: filterOpen } = useFilterStore();

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-120px)]">
      {/* Page intro */}
      <div className="px-4 pt-5 pb-2 max-w-screen-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-0.5" style={{ fontFamily: 'var(--font-title)' }}>
          Periodic Table of Elements
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Click any element to explore its properties, electron configuration, and real-world uses.
        </p>
      </div>

      {/* Legend */}
      <CategoryLegend />

      {/* Filter chips (active filters) */}
      <FilterChips />

      {/* Controls */}
      <TableControls />

      {/* Table */}
      <div className="overflow-x-auto pt-3 max-w-screen-2xl mx-auto">
        <PeriodicTable />
      </div>

      {/* Element detail panel */}
      {selectedElement && <ElementPanel />}

      {/* Filter panel */}
      {filterOpen && <FilterPanel />}
    </div>
  );
}
