type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      spotify_connection: Table<
        {
          id: number;
          access_token: string;
          refresh_token: string;
          expires_at: string;
          scope: string | null;
          updated_at: string;
        },
        {
          id: number;
          access_token: string;
          refresh_token?: string;
          expires_at: string;
          scope?: string | null;
          updated_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
