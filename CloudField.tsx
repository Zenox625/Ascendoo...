"use client";

import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useSpotifyPlayer } from "@/lib/spotify-player-context";

export default function MiniPlayer() {
  const { status, playbackState, togglePlay, next, previous } = useSpotifyPlayer();

  if (status !== "ready" || !playbackState) return null;
  const track = playbackState.track_window?.current_track;
  if (!track) return null;

  return (
    <div className="mini-player">
      <div className="mini-player-track">
        {track.album.images[0] && <img src={track.album.images[0].url} alt="" className="mini-player-art" />}
        <div style={{ minWidth: 0 }}>
          <div className="mini-player-name">{track.name}</div>
          <div className="mini-player-artist">{track.artists.map((a) => a.name).join(", ")}</div>
        </div>
      </div>
      <div className="row-gap">
        <button className="btn-icon" onClick={previous}>
          <SkipBack size={14} />
        </button>
        <button className="btn-icon" onClick={togglePlay}>
          {playbackState.paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
        <button className="btn-icon" onClick={next}>
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}
