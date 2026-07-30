import Link from "next/link";
import { isSpotifyConnected } from "@/lib/spotify";
import SpotifySection from "@/components/SpotifySection";
import SpotifyDisconnect from "@/components/SpotifyDisconnect";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ spotify_connected?: string; spotify_error?: string }>;
}) {
  const params = await searchParams;
  const connected = await isSpotifyConnected();

  return (
    <div className="glass-page">
      <div className="glass-card">
        <div className="row-between mb-16">
          <h2 className="h2" style={{ margin: 0 }}>Settings</h2>
          <Link href="/" className="btn-icon" aria-label="Back to universe">←</Link>
        </div>

        {params.spotify_connected && (
          <div className="mb-16" style={{ fontSize: 12.5, color: "var(--accent)" }}>Spotify connected.</div>
        )}
        {params.spotify_error && (
          <div className="mb-16" style={{ fontSize: 12.5, color: "#C24E3A" }}>
            Couldn&apos;t connect Spotify ({params.spotify_error}). Try again.
          </div>
        )}

        <div className="row-between mb-16">
          <div>
            <div className="card-title">Spotify</div>
            <div className="card-sub">{connected ? "Connected" : "Not connected"}</div>
          </div>
          {connected ? (
            <SpotifyDisconnect />
          ) : (
            <a href="/api/spotify/login" className="btn btn-accent">Connect Spotify</a>
          )}
        </div>
        {connected && <SpotifySection />}
      </div>
    </div>
  );
}
