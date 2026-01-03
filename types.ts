
export type ContentType = 'movie' | 'series';

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl?: string;
  videoUrl: string;
  introStart?: number; // Seconds when intro starts
  introEnd?: number;   // Seconds when intro ends (target for skip)
}

export interface Season {
  id: string;
  number: number;
  title: string; // e.g., "Season 1"
  episodes: Episode[];
}

// 0.0 to 1.0 scales for Vector Matching
export interface ContentAttributes {
    adrenaline: number; // 0 (Slow burn) -> 1 (Non-stop action)
    emotion: number;    // 0 (Cold/Clinical) -> 1 (Heartbreaking/Joyful)
    intellect: number;  // 0 (Brainless fun) -> 1 (Complex/Philosophical)
}

export interface AnimeSource {
    site: string;
    seriesUrl: string;
    animeId: number;
    generatedAt: string;
}

export interface Movie {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string; // If it's a movie, this is the main link
  backdropUrl?: string; // Larger image for Hero/Details
  rating?: string; // e.g. "16+", "TV-MA"
  contentAdvisory?: string[]; // New: e.g. ["אלימות", "שפה גסה", "עירום"]
  matchScore?: number; // e.g., 98
  year?: number | string;
  genre?: string[];
  cast?: string[]; // New: List of actors
  seasons?: Season[]; // If it's a series
  isExternalLink?: boolean;
  progress?: number; // % viewed, for "Continue Watching"
  introStart?: number; // Seconds for movies
  introEnd?: number;   // Seconds for movies
  
  // AI Algorithms Data
  attributes?: ContentAttributes; // DNA of the content
  keywords?: string[]; // Micro-genres for specific matching

  // Extended Data
  englishName?: string;
  source?: AnimeSource;
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
  reason?: string; // Why this category exists (e.g., "Because you watched Inception")
}
