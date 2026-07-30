"use client";

import { useState, type MutableRefObject } from "react";
import Cloud from "@/components/universe/Cloud";

export const CATEGORIES = ["MAIN", "MIND", "BODY", "ACADEMY", "SIDES", "PROFILE"];
export const SPACING = 6;
export const TOTAL_WIDTH = CATEGORIES.length * SPACING;

export default function CloudField({
  offsetRef,
  selected,
  fadeRef,
  onSelect,
}: {
  offsetRef: MutableRefObject<number>;
  selected: number | null;
  fadeRef: MutableRefObject<number>;
  onSelect: (index: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      {CATEGORIES.map((label, i) => (
        <Cloud
          key={label}
          label={label}
          baseX={i * SPACING}
          offsetRef={offsetRef}
          totalWidth={TOTAL_WIDTH}
          hovered={hovered === i && selected === null}
          onPointerOver={() => setHovered(i)}
          onPointerOut={() => setHovered((h) => (h === i ? null : h))}
          onClick={() => onSelect(i)}
          fadeRef={fadeRef}
          isSelected={selected === i}
          isAnySelected={selected !== null}
        />
      ))}
    </>
  );
}
