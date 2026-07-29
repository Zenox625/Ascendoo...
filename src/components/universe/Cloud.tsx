"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type CloudProps = {
  label: string;
  baseX: number;
  offsetRef: React.MutableRefObject<number>;
  totalWidth: number;
  hovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
  fadeRef: React.MutableRefObject<number>;
  isSelected: boolean;
  isAnySelected: boolean;
};

function wrap(base: number, offset: number, totalWidth: number) {
  let x = base - offset;
  x = (((x + totalWidth / 2) % totalWidth) + totalWidth) % totalWidth;
  return x - totalWidth / 2;
}

// Deterministic pseudo-random offsets per cloud "puff", seeded by index so
// each cloud has a consistent, non-uniform silhouette instead of a perfect
// sphere cluster.
function puffLayout(seed: number) {
  const rand = (n: number) => {
    const x = Math.sin(seed * 999 + n * 57.13) * 10000;
    return x - Math.floor(x);
  };
  const puffs: { pos: [number, number, number]; scale: number }[] = [];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r = 0.55 + rand(i) * 0.35;
    puffs.push({
      pos: [Math.cos(angle) * r, (rand(i + 10) - 0.5) * 0.35, Math.sin(angle) * r * 0.4],
      scale: 0.55 + rand(i + 20) * 0.35,
    });
  }
  puffs.push({ pos: [0, 0, 0], scale: 0.85 });
  return puffs;
}

export default function Cloud({ label, baseX, offsetRef, totalWidth, hovered, onPointerOver, onPointerOut, onClick, fadeRef, isSelected, isAnySelected }: CloudProps) {
  const group = useRef<THREE.Group>(null);
  const puffs = useMemo(() => puffLayout(baseX), [baseX]);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const spriteMatRef = useRef<THREE.SpriteMaterial>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.x = wrap(baseX, offsetRef.current, totalWidth);
    group.current.rotation.y += delta * 0.06;
    const targetScale = hovered ? 1.08 : 1;
    const s = THREE.MathUtils.lerp(group.current.scale.x, targetScale, Math.min(1, delta * 6));
    group.current.scale.setScalar(s);

    const fade = !isAnySelected ? 1 : isSelected ? 1 : Math.max(0, 1 - fadeRef.current);
    for (const m of materialsRef.current) m.opacity = 0.5 * fade;
    if (spriteMatRef.current) spriteMatRef.current.opacity = 0.85 * fade;
  });

  return (
    <group ref={group} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
      {puffs.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) materialsRef.current[i] = m;
            }}
            color="#E8ECF5"
            transparent
            opacity={0.5}
            roughness={1}
            emissive="#8FA5D8"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      <sprite position={[0, -1.1, 0]} scale={[2.2, 0.5, 1]}>
        <spriteMaterial ref={spriteMatRef} transparent opacity={0.85} depthWrite={false}>
          <canvasTexture attach="map" args={[labelCanvas(label)]} />
        </spriteMaterial>
      </sprite>
    </group>
  );
}

function labelCanvas(text: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "600 56px Georgia, serif";
  ctx.fillStyle = "#F0EDE4";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "4px";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas;
}
