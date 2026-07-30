"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

function labelCanvas(text: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 80;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "500 34px -apple-system, sans-serif";
  ctx.fillStyle = "#1A1B1E";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return canvas;
}

export default function SubItem({
  label,
  center,
  offset,
}: {
  label: string;
  center: [number, number, number];
  offset: [number, number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const position: [number, number, number] = [center[0] + offset[0], center[1] + offset[1], center[2] + offset[2]];
  const mid: [number, number, number] = [
    center[0] + offset[0] * 0.5,
    center[1] + offset[1] * 0.5 + 0.4,
    center[2] + offset[2] * 0.5,
  ];

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = hovered ? 1.12 : 1;
    const s = THREE.MathUtils.lerp(group.current.scale.x, targetScale, Math.min(1, delta * 6));
    group.current.scale.setScalar(s);
  });

  return (
    <>
      <QuadraticBezierLine start={center} end={position} mid={mid} color={hovered ? "#4F8DE6" : "#B8B4A8"} lineWidth={1.4} transparent opacity={0.7} />
      <group ref={group} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <mesh>
          <planeGeometry args={[1.5, 0.55]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} transparent opacity={hovered ? 0.95 : 0.75} side={THREE.DoubleSide} />
        </mesh>
        <sprite position={[0, 0, 0.02]} scale={[1.4, 0.35, 1]}>
          <spriteMaterial transparent depthWrite={false}>
            <canvasTexture attach="map" args={[labelCanvas(label)]} />
          </spriteMaterial>
        </sprite>
      </group>
    </>
  );
}
