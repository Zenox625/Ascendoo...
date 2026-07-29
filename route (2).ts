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
      <meshPhysicalMaterial
        color="#EDEAE2"
        transmission={0.92}
        thickness={1.1}
        roughness={0.06}
        ior={1.4}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={1.3}
      />
    </mesh>
  );
}
