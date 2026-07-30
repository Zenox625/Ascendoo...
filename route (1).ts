"use client";

import { useState } from "react";
import { Search, Loader2, Play, ListPlus } from "lucide-react";
import { useSpotifyPlayer, type SearchTrack } from "@/lib/spotify-player-context";

export default function SpotifySearchPanel() {
  const { status, errorMsg, search, playNow, addToQueue } = useSpotifyPlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [queuedUri, setQueuedUri] = useState<string | null>(null);

  const runSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      setResults(await search(query));
    } finally {
      setSearching(false);
    }
  };

  const handleQueue = async (uri: string) => {
    await addToQueue(uri);
    setQueuedUri(uri);
    setTimeout(() => setQueuedUri((cur) => (cur === uri ? null : cur)), 1500);
  };

  if (status === "idle") {
    return <div className="empty-sub">Connect your Spotify account above to search and play music.</div>;
  }
  if (status === "loading_sdk" || status === "connecting") {
    return (
      <div className="row-gap" style={{ color: "var(--text-muted)", fontSize: 13 }}>
        <Loader2 size={14} className="spin" /> Connecting to Spotify…
      </div>
    );
  }
  if (status === "error") {
    return <div className="empty-sub">Spotify player error: {errorMsg}</div>;
  }

  return (
    <div>
      {status === "needs_premium" && (
        <div className="empty-sub mb-10">
          This Spotify account isn&apos;t Premium — in-browser playback requires Premium. Search still works below.
        </div>
      )}
      <div className="row-gap mb-10">
        <input
          className="input"
          placeholder="Search a track…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="btn-icon" onClick={runSearch} disabled={searching}>
          {searching ? <Loader2 size={14} className="spin" /> : <Search size={14} />}
        </button>
      </div>

      {results.length > 0 && (
        <div className="tracker-list">
          {results.map((t) => (
            <div key={t.uri} className="tracker-row">
              <div className="tracker-main">
                <div className="tracker-thumb">
                  {t.image ? <img src={t.image} alt="" /> : <div className="thumb-fallback">♪</div>}
                </div>
                <div className="tracker-info">
                  <div className="tracker-name">{t.name}</div>
                  <div className="tracker-meta">{t.artists}</div>
                </div>
              </div>
              <div className="row-gap">
                <button className="btn-icon" onClick={() => handleQueue(t.uri)} title="Add to queue">
                  {queuedUri === t.uri ? <span style={{ fontSize: 11, color: "var(--accent)" }}>Added</span> : <ListPlus size={14} />}
                </button>
                <button className="btn-icon" onClick={() => playNow(t.uri)} title="Play now">
                  <Play size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
