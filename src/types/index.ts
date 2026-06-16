export interface Track {
  id: number;
  title: string;
  title_short?: string;
  artist: {
    id: number;
    name: string;
    picture_medium?: string;
  };
  album: {
    id: number;
    title: string;
    cover_medium: string;
  };
  preview: string;
  duration?: number;
  rank?: number; // Popularity ranking index
  release_date?: string;
  genres?: string[];
}

export interface GameStats {
  played: number;
  won: number;
  bestScore: number;
  maxStreak: number;
  totalResponseTime: number; // in seconds
  totalAnswers: number;
}

export interface GameModeStats extends GameStats {
  modeId: string;
}

export interface UserStats {
  overall: GameStats;
  modes: Record<string, GameModeStats>;
  dnaProfile?: MusicDNAProfile;
}

export interface MusicDNAProfile {
  genres: Record<string, number>;
  decades: Record<string, number>;
  favoriteArtist: string;
  favoriteGenre: string;
  favoriteDecade: string;
  estimatedEnergy: string;
  timestamp: number;
}
