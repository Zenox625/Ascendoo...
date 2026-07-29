import type { Metadata } from "next";
import "./globals.css";
import MiniPlayer from "@/components/MiniPlayer";
import { SpotifyPlayerProvider } from "@/lib/spotify-player-context";

export const metadata: Metadata = {
  title: "Ascendo",
  description: "An immersive personal universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SpotifyPlayerProvider>
          {children}
          <MiniPlayer />
        </SpotifyPlayerProvider>
      </body>
    </html>
  );
}
