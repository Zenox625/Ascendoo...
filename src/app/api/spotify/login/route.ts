import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthorizeUrl } from "@/lib/spotify";

export async function GET() {
  const state = randomBytes(16).toString("hex");
  const res = NextResponse.redirect(buildAuthorizeUrl(state));
  res.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes is plenty to complete the consent screen
    path: "/",
  });
  return res;
}
