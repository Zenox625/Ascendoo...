"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import StarField from "@/components/universe/StarField";
import CloudField, { CATEGORIES, SPACING, TOTAL_WIDTH } from "@/components/universe/CloudField";

function wrap(base: number, offset: number) {
  let x = base - offset;
  x = (((x + TOTAL_WIDTH / 2) % TOTAL_WIDTH) + TOTAL_WIDTH) % TOTAL_WIDTH;
  return x - TOTAL_WIDTH / 2;
}

type Phase = "field" | "zooming" | "revealed";

function InertiaDriver({ offsetRef, velocityRef, active }: { offsetRef: React.MutableRefObject<number>; velocityRef: React.MutableRefObject<number>; active: boolean }) {
  useFrame(() => {
    if (!active) return;
    offsetRef.current += velocityRef.current;
    velocityRef.current *= 0.94;
    if (Math.abs(velocityRef.current) < 0.0005) velocityRef.current = 0;
  });
  return null;
}

function CameraRig({ phase, targetXRef, fadeRef }: { phase: Phase; targetXRef: React.MutableRefObject<number>; fadeRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const zoomStart = useRef<number | null>(null);

  // react-hooks/immutability flags mutating `camera` here, but this is the
  // standard React Three Fiber pattern: useFrame is an intentional escape
  // hatch for direct, imperative scene-graph mutation every frame (that's
  // how Three.js animation works), not React state.
  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    if (phase === "zooming" || phase === "revealed") {
      if (zoomStart.current === null) zoomStart.current = state.clock.elapsedTime;
      const t = Math.min(1, (state.clock.elapsedTime - zoomStart.current) / 1.3);
      fadeRef.current = t;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetXRef.current, delta * 1.8);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 1.4, delta * 1.8);
    } else {
      zoomStart.current = null;
      fadeRef.current = 0;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, delta * 2.5);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8, delta * 2.5);
    }
    camera.lookAt(camera.position.x, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */
  return null;
}

export default function UniverseApp() {
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const fadeRef = useRef(0);
  const targetXRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  const [phase, setPhase] = useState<Phase>("field");
  const [selected, setSelected] = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const handleSelect = useCallback((index: number) => {
    setSelected(index);
    targetXRef.current = wrap(index * SPACING, offsetRef.current);
    setPhase("zooming");
    requestAnimationFrame(() => setOverlayVisible(true));
    window.setTimeout(() => setPhase("revealed"), 1350);
  }, []);

  const handleBack = useCallback(() => {
    setOverlayVisible(false);
    window.setTimeout(() => {
      setPhase("field");
      setSelected(null);
    }, 500);
  }, []);

  // Pointer drag (mouse + touch)
  const onPointerDown = (e: React.PointerEvent) => {
    if (phase !== "field") return;
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || phase !== "field") return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    const delta = -dx * 0.02;
    offsetRef.current += delta;
    velocityRef.current = delta;
  };
  const endDrag = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (phase !== "field") return;
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.003;
      offsetRef.current += delta;
      velocityRef.current = delta;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [phase]);

  const categoryLabel = selected !== null ? CATEGORIES[selected] : "";

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#05060a", overflow: "hidden", touchAction: "none" }}>
      <div
        style={{ position: "absolute", inset: 0, cursor: phase === "field" ? "grab" : "default" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={0.8} />
          <StarField />
          <InertiaDriver offsetRef={offsetRef} velocityRef={velocityRef} active={phase === "field"} />
          <CameraRig phase={phase} targetXRef={targetXRef} fadeRef={fadeRef} />
          <CloudField offsetRef={offsetRef} selected={selected} fadeRef={fadeRef} onSelect={handleSelect} />
        </Canvas>
      </div>

      {/* white reveal overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, #F4F1EA 0%, #E4E0D8 100%)",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 1.1s ease",
          pointerEvents: "none",
        }}
      />

      {/* top-left back link */}
      <Link
        href="/settings"
        style={{
          position: "absolute", top: 20, left: 20, fontSize: 12, color: "#8D96A8",
          textDecoration: "none", padding: "8px 14px", border: "1px solid rgba(255,255,255,.15)",
          borderRadius: 100, fontFamily: "ui-monospace, Menlo, monospace",
        }}
      >
        ⚙ Settings
      </Link>

      {phase === "field" && (
        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", fontSize: 11.5, color: "rgba(255,255,255,.5)", fontFamily: "ui-monospace, Menlo, monospace", letterSpacing: 1 }}>
          drag or scroll horizontally — click a cloud
        </div>
      )}

      {phase === "revealed" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 42, letterSpacing: 6, color: "#1A1B1E" }}>{categoryLabel}</div>
          <div style={{ fontSize: 13, color: "#5B5D63", maxWidth: 320, textAlign: "center", lineHeight: 1.6 }}>
            This is where the {categoryLabel.toLowerCase()} object and its sub-categories will live — next step once the core feel is confirmed.
          </div>
          <button
            onClick={handleBack}
            style={{ marginTop: 8, padding: "10px 22px", borderRadius: 100, border: "1px solid #1A1B1E", background: "transparent", color: "#1A1B1E", fontSize: 12.5, cursor: "pointer" }}
          >
            ← Back to universe
          </button>
        </div>
      )}
    </div>
  );
}
