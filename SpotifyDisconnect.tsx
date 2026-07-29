export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayerInstance;
    };
  }
}

export interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, cb: (data: unknown) => void) => void;
  removeListener: (event: string) => void;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  getCurrentState: () => Promise<SpotifyPlaybackState | null>;
}

export interface SpotifyPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      name: string;
      artists: { name: string }[];
      album: { name: string; images: { url: string }[] };
    };
  };
}
