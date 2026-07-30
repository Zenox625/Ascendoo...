import { NextResponse } from "next/server";
import { disconnectSpotify } from "@/lib/spotify";

export async function POST() {
  try {
    await disconnectSpotify();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Spotify disconnect error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
