import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, saveConnection } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const expectedState = req.cookies.get("spotify_oauth_state")?.value;

  const settingsUrl = new URL("/settings", req.url);

  if (error) {
    settingsUrl.searchParams.set("spotify_error", error);
    return NextResponse.redirect(settingsUrl);
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    settingsUrl.searchParams.set("spotify_error", "state_mismatch");
    return NextResponse.redirect(settingsUrl);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await saveConnection(tokens);
    settingsUrl.searchParams.set("spotify_connected", "1");
  } catch (e) {
    console.error("Spotify callback error:", e);
    settingsUrl.searchParams.set("spotify_error", "exchange_failed");
  }

  const res = NextResponse.redirect(settingsUrl);
  res.cookies.delete("spotify_oauth_state");
  return res;
}
