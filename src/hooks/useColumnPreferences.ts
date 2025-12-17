import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { COLUMN_DEFINITIONS, getDefaultVisibleColumns } from "../lib/columnConfig";
import type { LatencyMetricType, LatencyPercentileType } from "../types";

const STORAGE_KEY = "performanceTableColumnPreferences";
const MANUAL_LATENCY_STORAGE_KEY = "performanceTableManualLatencyColumns";

// Custom hook to track mounted state
const useIsMounted = () => {
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

// Helper to check if a column is a latency column
const isLatencyColumn = (columnId: string): boolean => {
  const col = COLUMN_DEFINITIONS.find(c => c.id === columnId);
  return col?.group === 'latency';
};

// Get the latency column ID for a given metric and percentile
const getLatencyColumnId = (metric: LatencyMetricType, percentile: LatencyPercentileType): string => {
  return `${metric.toLowerCase()}-${percentile.toLowerCase()}`;
};

export function useColumnPreferences(
  latencyMetric: LatencyMetricType,
  latencyPercentile: LatencyPercentileType
) {
  const isMounted = useIsMounted();
  
  // Track which latency columns the user has manually selected
  const [manualLatencyColumns, setManualLatencyColumns] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(MANUAL_LATENCY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    return [];
  });

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Initialize from localStorage or defaults
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    return getDefaultVisibleColumns(latencyMetric, latencyPercentile);
  });

  // Track the previous latency filter to detect changes
  const prevLatencyRef = useRef({ metric: latencyMetric, percentile: latencyPercentile });

  // Update visible columns when latency filter changes
  useEffect(() => {
    // Don't update if unmounted
    if (!isMounted.current) return;
    
    const prevMetric = prevLatencyRef.current.metric;
    const prevPercentile = prevLatencyRef.current.percentile;
    const prevLatencyColId = getLatencyColumnId(prevMetric, prevPercentile);
    const newLatencyColId = getLatencyColumnId(latencyMetric, latencyPercentile);

    // Only update if the latency filter actually changed
    if (prevMetric !== latencyMetric || prevPercentile !== latencyPercentile) {
      setVisibleColumns(prev => {
        // Remove the old auto-visible latency column (unless it was manually selected)
        let updated = prev.filter(colId => {
          if (colId === prevLatencyColId && !manualLatencyColumns.includes(colId)) {
            return false; // Remove old auto-visible latency column
          }
          return true;
        });

        // Add the new latency column if not already present
        if (!updated.includes(newLatencyColId)) {
          updated = [...updated, newLatencyColId];
        }

        return updated;
      });

      // Update the ref
      prevLatencyRef.current = { metric: latencyMetric, percentile: latencyPercentile };
    }
  }, [latencyMetric, latencyPercentile, manualLatencyColumns, isMounted]);

  // Save to localStorage whenever visibleColumns changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
    } catch (e) {
      // Ignore storage errors
    }
  }, [visibleColumns]);

  // Save manual latency columns to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MANUAL_LATENCY_STORAGE_KEY, JSON.stringify(manualLatencyColumns));
    } catch (e) {
      // Ignore storage errors
    }
  }, [manualLatencyColumns]);

  const toggleColumn = useCallback((columnId: string) => {
    setVisibleColumns(prev => {
      const isCurrentlyVisible = prev.includes(columnId);
      
      // Track manual selections for latency columns
      if (isLatencyColumn(columnId)) {
        if (isCurrentlyVisible) {
          // User is hiding a latency column - remove from manual selections
          setManualLatencyColumns(manual => manual.filter(id => id !== columnId));
        } else {
          // User is showing a latency column - add to manual selections
          setManualLatencyColumns(manual => 
            manual.includes(columnId) ? manual : [...manual, columnId]
          );
        }
      }
      
      if (isCurrentlyVisible) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  const setVisibleColumnsList = useCallback((columns: string[]) => {
    setVisibleColumns(columns);
  }, []);

  const restoreDefaults = useCallback(() => {
    const defaults = getDefaultVisibleColumns(latencyMetric, latencyPercentile);
    setVisibleColumns(defaults);
    // Clear manual latency selections when restoring defaults
    setManualLatencyColumns([]);
  }, [latencyMetric, latencyPercentile]);

  const isColumnVisible = useCallback((columnId: string) => {
    return visibleColumns.includes(columnId);
  }, [visibleColumns]);

  return {
    visibleColumns,
    toggleColumn,
    setVisibleColumns: setVisibleColumnsList,
    restoreDefaults,
    isColumnVisible,
  };
}

