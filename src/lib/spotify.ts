import { supabaseAdmin } from "@/lib/supabase";

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function spotifyRedirectUri(): string {
  return requiredEnv("SPOTIFY_REDIRECT_URI");
}

export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: requiredEnv("SPOTIFY_CLIENT_ID"),
    scope: SPOTIFY_SCOPES,
    redirect_uri: spotifyRedirectUri(),
    state,
  });
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

function basicAuthHeader(): string {
  const id = requiredEnv("SPOTIFY_CLIENT_ID");
  const secret = requiredEnv("SPOTIFY_CLIENT_SECRET");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: spotifyRedirectUri(),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token exchange failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function refreshTokens(refreshToken: string): Promise<SpotifyTokenResponse> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify token refresh failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function saveConnection(tokens: SpotifyTokenResponse) {
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const { error } = await supabaseAdmin()
    .from("spotify_connection")
    .upsert({
      id: 1,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token, // only present on the initial exchange
      expires_at: expiresAt,
      scope: tokens.scope,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
}

/**
 * Returns a valid access token, transparently refreshing it first if it's
 * expired or about to expire (60s buffer). Returns null if no account has
 * been connected yet.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const { data, error } = await supabaseAdmin()
    .from("spotify_connection")
    .select("access_token, refresh_token, expires_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const expiresAt = new Date(data.expires_at as string).getTime();
  const stillValid = expiresAt - Date.now() > 60_000;
  if (stillValid) return data.access_token as string;

  const refreshed = await refreshTokens(data.refresh_token as string);
  const expiresAtNew = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

  const { error: updateError } = await supabaseAdmin()
    .from("spotify_connection")
    .update({
      access_token: refreshed.access_token,
      // Spotify doesn't always rotate the refresh token — keep the old one if absent.
      refresh_token: refreshed.refresh_token ?? data.refresh_token,
      expires_at: expiresAtNew,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (updateError) throw updateError;

  return refreshed.access_token;
}

export async function disconnectSpotify() {
  const { error } = await supabaseAdmin().from("spotify_connection").delete().eq("id", 1);
  if (error) throw error;
}

export async function isSpotifyConnected(): Promise<boolean> {
  const { data, error } = await supabaseAdmin()
    .from("spotify_connection")
    .select("id")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
