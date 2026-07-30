"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SpotifyDisconnect() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const disconnect = async () => {
    setLoading(true);
    await fetch("/api/spotify/disconnect", { method: "POST" });
    setLoading(false);
    router.refresh();
  };

  return (
    <button className="btn btn-ghost" onClick={disconnect} disabled={loading}>
      {loading ? "Disconnecting…" : "Disconnect"}
    </button>
  );
}
