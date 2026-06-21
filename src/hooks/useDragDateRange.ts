"use client";

import { useCallback, useEffect, useState } from "react";

function normalizeRange(start: string, end: string): [string, string] {
  return start <= end ? [start, end] : [end, start];
}

export function useDragDateRange(
  onSelect: (startDate: string, endDate: string) => void,
) {
  const [anchor, setAnchor] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);

  const isDragging = anchor !== null;

  const startDrag = useCallback((date: string) => {
    setAnchor(date);
    setFocus(date);
  }, []);

  const extendDrag = useCallback(
    (date: string) => {
      if (anchor) setFocus(date);
    },
    [anchor],
  );

  const cancelDrag = useCallback(() => {
    setAnchor(null);
    setFocus(null);
  }, []);

  const endDrag = useCallback(() => {
    if (anchor && focus) {
      const [start, end] = normalizeRange(anchor, focus);
      onSelect(start, end);
    }
    setAnchor(null);
    setFocus(null);
  }, [anchor, focus, onSelect]);

  const isInRange = useCallback(
    (date: string) => {
      if (!anchor || !focus) return false;
      const [start, end] = normalizeRange(anchor, focus);
      return date >= start && date <= end;
    },
    [anchor, focus],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseUp = () => endDrag();

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging, endDrag]);

  return {
    startDrag,
    extendDrag,
    cancelDrag,
    isInRange,
    isDragging,
  };
}

export type DragDateRange = ReturnType<typeof useDragDateRange>;
