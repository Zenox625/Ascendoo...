"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import type { SpotifyPlayerInstance, SpotifyPlaybackState } from "@/types/spotify-sdk";

export type Status = "idle" | "loading_sdk" | "connecting" | "ready" | "needs_premium" | "error";

export type SearchTrack = { uri: string; name: string; artists: string; image?: string };

type SpotifySearchTrack = {
  uri: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
};

type Ctx = {
  status: Status;
  errorMsg: string | null;
  playbackState: SpotifyPlaybackState | null;
  search: (query: string) => Promise<SearchTrack[]>;
  playNow: (uri: string) => Promise<void>;
  addToQueue: (uri: string) => Promise<void>;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
};

const SpotifyPlayerCtx = createContext<Ctx | null>(null);

export function useSpotifyPlayer() {
  const ctx = useContext(SpotifyPlayerCtx);
  if (!ctx) throw new Error("useSpotifyPlayer must be used inside SpotifyPlayerProvider");
  return ctx;
}

export function SpotifyPlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<SpotifyPlayerInstance | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null);

  const fetchToken = useCallback(async (): Promise<string | null> => {
    const res = await fetch("/api/spotify/token");
    const data = await res.json();
    return data.connected ? data.access_token : null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = await fetchToken();
      if (!token || cancelled) {
        setStatus("idle");
        return;
      }
      setStatus("loading_sdk");

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        if (cancelled) return;
        setStatus("connecting");
        const player = new window.Spotify.Player({
          name: "Ascendo",
          getOAuthToken: (cb) => {
            fetchToken().then((t) => cb(t ?? ""));
          },
          volume: 0.6,
        });

        player.addListener("ready", (data) => {
          const { device_id } = data as { device_id: string };
          deviceIdRef.current = device_id;
          setStatus("ready");
        });
        player.addListener("not_ready", () => setStatus("connecting"));
        player.addListener("initialization_error", (d) => {
          setStatus("error");
          setErrorMsg((d as { message: string }).message);
        });
        player.addListener("authentication_error", (d) => {
          setStatus("error");
          setErrorMsg((d as { message: string }).message);
        });
        player.addListener("account_error", () => setStatus("needs_premium"));
        player.addListener("player_state_changed", (d) => setPlaybackState(d as SpotifyPlaybackState));

        player.connect();
        playerRef.current = player;
      };
    })();

    return () => {
      cancelled = true;
      playerRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = useCallback(
    async (query: string): Promise<SearchTrack[]> => {
      if (!query.trim()) return [];
      const token = await fetchToken();
      if (!token) return [];
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=8`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return (data.tracks?.items ?? []).map((t: SpotifySearchTrack) => ({
        uri: t.uri,
        name: t.name,
        artists: t.artists.map((a) => a.name).join(", "),
        image: t.album?.images?.[2]?.url ?? t.album?.images?.[0]?.url,
      }));
    },
    [fetchToken]
  );

  const playNow = useCallback(
    async (uri: string) => {
      const token = await fetchToken();
      if (!token || !deviceIdRef.current) return;
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [uri] }),
      });
    },
    [fetchToken]
  );

  const addToQueue = useCallback(
    async (uri: string) => {
      const token = await fetchToken();
      if (!token || !deviceIdRef.current) return;
      await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}&device_id=${deviceIdRef.current}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    [fetchToken]
  );

  const togglePlay = useCallback(() => playerRef.current?.togglePlay(), []);
  const next = useCallback(() => playerRef.current?.nextTrack(), []);
  const previous = useCallback(() => playerRef.current?.previousTrack(), []);

  return (
    <SpotifyPlayerCtx.Provider value={{ status, errorMsg, playbackState, search, playNow, addToQueue, togglePlay, next, previous }}>
      {children}
    </SpotifyPlayerCtx.Provider>
  );
}
