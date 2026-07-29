import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/spotify";

export async function GET() {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      return NextResponse.json({ connected: false }, { status: 200 });
    }
    return NextResponse.json({ connected: true, access_token: token });
  } catch (e) {
    console.error("Spotify token route error:", e);
    return NextResponse.json({ connected: false, error: "token_error" }, { status: 500 });
  }
}
