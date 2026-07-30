"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlassObject({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [spinning, setSpinning] = useState(true);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    if (spinning) mesh.current.rotation.y += delta * 0.25;
    const targetScale = hovered ? 1.04 : 1;
    const s = THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, Math.min(1, delta * 5));
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={[Math.PI / 5, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSpinning((s) => !s);
      }}
    >
      <torusGeometry args={[1.1, 0.42, 64, 128]} />
      <meshStandardMaterial color="#4F8DE6" roughness={0.4} metalness={0.1} />
      {/* Diagnostic: temporarily plain and bright instead of the glass
          MeshPhysicalMaterial (transmission), to confirm whether the object
          itself mounts and positions correctly before reintroducing the
          fancier — but more GPU/driver-sensitive — glass look. */}
    </mesh>
  );
}
