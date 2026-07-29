"use client";

import dynamicImport from "next/dynamic";

const UniverseApp = dynamicImport(() => import("@/components/universe/UniverseApp"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100vw", height: "100vh", background: "#05060a", display: "flex", alignItems: "center", justifyContent: "center", color: "#8D96A8", fontSize: 13 }}>
      Loading universe…
    </div>
  ),
});

export default function UniversePreviewClient() {
  return <UniverseApp />;
}
