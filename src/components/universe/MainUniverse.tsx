"use client";

import GlassObject from "@/components/universe/GlassObject";
import SubItem from "@/components/universe/SubItem";

const SUB_ITEMS = ["Routine", "Tasks", "Habits", "Journal"];

export default function MainUniverse({ position }: { position: [number, number, number] }) {
  const radius = 2.6;
  return (
    <group>
      <GlassObject position={position} />
      {SUB_ITEMS.map((label, i) => {
        const angle = (i / SUB_ITEMS.length) * Math.PI * 2 - Math.PI / 2;
        const offset: [number, number, number] = [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.6, Math.sin(angle) * 0.6];
        return <SubItem key={label} label={label} center={position} offset={offset} />;
      })}
    </group>
  );
}
