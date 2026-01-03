
import { Movie, Category, ContentAttributes } from './types';
import { ALL_MOVIES } from './data/movies';
import { ALL_SERIES } from './data/series';

// ==========================================
//           EYALATIATV CONTENT LIBRARY
// ==========================================

// Helper to auto-generate vector attributes if missing, based on Genre
const generateAttributesFromGenre = (genres: string[] = []): ContentAttributes => {
    let attr = { adrenaline: 0.3, emotion: 0.3, intellect: 0.3 }; // Low Baseline
    
    if (genres.includes('אקשן')) { attr.adrenaline += 0.5; attr.intellect -= 0.1; }
    if (genres.includes('מתח')) { attr.adrenaline += 0.3; attr.intellect += 0.3; }
    if (genres.includes('מדע בדיוני')) { attr.intellect += 0.4; attr.emotion -= 0.1; }
    if (genres.includes('דרמה')) { attr.emotion += 0.5; attr.adrenaline -= 0.2; }
    if (genres.includes('קומדיה')) { attr.emotion += 0.3; attr.intellect -= 0.2; }
    if (genres.includes('אימה')) { attr.adrenaline += 0.4; attr.emotion += 0.2; }
    if (genres.includes('דוקומנטרי')) { attr.intellect += 0.5; attr.adrenaline -= 0.3; }
    if (genres.includes('פנטזיה')) { attr.emotion += 0.2; attr.adrenaline += 0.2; }
    if (genres.includes('אנימציה') || genres.includes('אנימה')) { attr.emotion += 0.2; attr.adrenaline += 0.1; }

    // Clamp values 0-1
    return {
        adrenaline: Math.min(1, Math.max(0, attr.adrenaline)),
        emotion: Math.min(1, Math.max(0, attr.emotion)),
        intellect: Math.min(1, Math.max(0, attr.intellect)),
    };
};

// Enrich library with calculated attributes
const RAW_LIBRARY: Movie[] = [...ALL_MOVIES, ...ALL_SERIES];
const CONTENT_LIBRARY: Movie[] = RAW_LIBRARY.map(m => ({
    ...m,
    attributes: m.attributes || generateAttributesFromGenre(m.genre)
}));

// ==========================================
//           EXPORTED HELPERS
// ==========================================

export const FEATURED_MOVIE = CONTENT_LIBRARY.find(movie => movie.id === 'blade-runner-2049') || CONTENT_LIBRARY[0];
export const getAllContent = (): Movie[] => CONTENT_LIBRARY;
export const getContentById = (id: string): Movie | undefined => CONTENT_LIBRARY.find(item => item.id === id);


// ==========================================
//      EYALATIATV VECTOR ENGINE (ALGORITHM)
// ==========================================

/**
 * Calculates Euclidean Distance between two content vectors.
 * Lower distance = Higher similarity.
 */
const calculateVectorDistance = (a: ContentAttributes, b: ContentAttributes): number => {
    return Math.sqrt(
        Math.pow(a.adrenaline - b.adrenaline, 2) + 
        Math.pow(a.emotion - b.emotion, 2) + 
        Math.pow(a.intellect - b.intellect, 2)
    );
};

/**
 * Creates a Dynamic "User Vector" based on:
 * 1. Preferred Genres (Onboarding)
 * 2. Watched History (Completed items)
 */
const getUserVector = (preferredGenres: string[], watchedHistoryIds: string[] = []): ContentAttributes => {
    // 1. Calculate Baseline from Genres
    const baseVector = generateAttributesFromGenre(preferredGenres);
    
    // If no history, return genre preferences only
    if (watchedHistoryIds.length === 0) return baseVector;

    // 2. Calculate History Vector from completed movies
    let historyAdrenaline = 0;
    let historyEmotion = 0;
    let historyIntellect = 0;
    let count = 0;

    watchedHistoryIds.forEach(id => {
        const movie = CONTENT_LIBRARY.find(m => m.id === id);
        if (movie && movie.attributes) {
            historyAdrenaline += movie.attributes.adrenaline;
            historyEmotion += movie.attributes.emotion;
            historyIntellect += movie.attributes.intellect;
            count++;
        }
    });

    if (count === 0) return baseVector;

    // Average the history
    const historyVector = {
        adrenaline: historyAdrenaline / count,
        emotion: historyEmotion / count,
        intellect: historyIntellect / count
    };

    // 3. Blend: 40% Genres (Static Identity) + 60% History (Evolving Taste)
    // As history grows, it becomes more dominant
    const historyWeight = Math.min(0.8, 0.2 + (count * 0.1)); // Cap at 80% weight for history
    const genreWeight = 1 - historyWeight;

    return {
        adrenaline: (baseVector.adrenaline * genreWeight) + (historyVector.adrenaline * historyWeight),
        emotion: (baseVector.emotion * genreWeight) + (historyVector.emotion * historyWeight),
        intellect: (baseVector.intellect * genreWeight) + (historyVector.intellect * historyWeight)
    };
};

/**
 * The core scoring function.
 * Combines Vector Distance (Taste) + Social Proof (Rating) + Context (Time).
 */
const calculateSmartScore = (
    movie: Movie, 
    userVector: ContentAttributes, 
    preferredGenres: string[],
    timeContext: 'morning' | 'day' | 'night'
): number => {
    let score = 100;

    // 1. Vector Similarity (The Core "Taste" Logic)
    // Distance usually ranges 0 to 1.73. 
    // We convert distance to a similarity percentage.
    const distance = calculateVectorDistance(movie.attributes!, userVector);
    
    // Impact: High similarity (dist 0) -> penalty 0. Low similarity (dist 1.5) -> penalty 60.
    const distancePenalty = (distance * 45); 
    score -= distancePenalty;

    // 2. Direct Genre Bonus (Legacy preference boost)
    const hasGenreMatch = movie.genre?.some(g => preferredGenres.includes(g));
    if (hasGenreMatch) score += 5;

    // 3. Quality Bias (Global Rating)
    // Normalize rating from database (assuming roughly 80-100 scale in data)
    // If unknown, assume 85.
    const baseRating = movie.matchScore || 85; 
    score += (baseRating - 90) * 0.5; // Slight boost for masterpieces

    // 4. Time Context Awareness
    if (timeContext === 'morning') {
        if (movie.attributes!.intellect > 0.6 || movie.attributes!.emotion > 0.6) score += 5;
        if (movie.attributes!.adrenaline > 0.8) score -= 10;
    } else if (timeContext === 'night') {
        if (movie.attributes!.adrenaline > 0.6) score += 5;
    }

    // Clamp Score to 60-99%
    return Math.min(99, Math.max(60, Math.round(score)));
};

// Extended Category Interface to support special row types
export interface ExtendedCategory extends Category {
    isRanked?: boolean;
}

const getYear = (year: string | number | undefined): number => {
    if (typeof year === 'string') return parseInt(year, 10);
    return year || 0;
};

export const getPersonalizedCategories = (preferredGenres: string[], watchedHistory: string[], currentMood?: string): ExtendedCategory[] => {
    const hour = new Date().getHours();
    const timeContext = hour < 12 ? 'morning' : hour < 20 ? 'day' : 'night';
    
    // Calculate the dynamic user vector
    const userVector = getUserVector(preferredGenres, watchedHistory);

    // Filter by Mood if active
    let pool = CONTENT_LIBRARY;
    if (currentMood) {
        switch(currentMood) {
            case 'chill': pool = pool.filter(m => m.attributes!.adrenaline < 0.5); break;
            case 'pumped': pool = pool.filter(m => m.attributes!.adrenaline > 0.6); break;
            case 'smart': pool = pool.filter(m => m.attributes!.intellect > 0.6); break;
            case 'scary': pool = pool.filter(m => m.genre?.includes('אימה') || m.genre?.includes('מתח')); break;
        }
    }

    // CALCULATE MATCH SCORE FOR EVERY ITEM
    const scoredContent = pool.map(movie => {
        const smartScore = calculateSmartScore(movie, userVector, preferredGenres, timeContext);
        return { ...movie, matchScore: smartScore };
    }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const categories: ExtendedCategory[] = [];
    const usedIds = new Set<string>();

    const addCat = (id: string, title: string, items: Movie[], isRanked: boolean = false) => {
        // We allow some duplicates for "Top 10" vs "Action", but generally try to keep unique
        const uniqueItems = items.filter(i => !usedIds.has(i.id));
        const itemsToAdd = isRanked ? items : uniqueItems; // Ranked rows can reuse items
        
        if (itemsToAdd.length > 0) {
            categories.push({ id, title, movies: itemsToAdd, isRanked });
            itemsToAdd.forEach(i => usedIds.add(i.id));
        }
    };

    // --- 1. SPECIAL: TOP 10 IN ISRAEL (Global Popularity) ---
    // In a real app, this comes from analytics. Here, we simulate it with high match scores + random shuffling.
    const top10 = [...CONTENT_LIBRARY]
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 10);
    // Don't mark as used, so they can appear in genre rows too
    categories.push({ id: 'top-10-il', title: '10 המובילים בישראל היום', movies: top10, isRanked: true });


    // --- 2. MATCH FOR YOU (Personalized) ---
    const unwatchedScored = scoredContent.filter(m => !watchedHistory.includes(m.id));
    addCat('top-picks', currentMood ? `המלצות למצב רוח: ${getMoodLabel(currentMood)}` : 'מותאם במיוחד עבורך', unwatchedScored.slice(0, 10));


    // --- 3. NEW RELEASES (Fresh Content) ---
    const newReleases = scoredContent.filter(m => getYear(m.year) >= 2023).slice(0, 10);
    addCat('new-releases', 'חדש ב-EyalAtiaTV', newReleases);


    // --- 4. BECAUSE YOU WATCHED (History Based) ---
    if (watchedHistory.length > 0) {
        const lastWatchedId = watchedHistory[0]; 
        const lastWatched = CONTENT_LIBRARY.find(m => m.id === lastWatchedId);
        if (lastWatched && lastWatched.genre) {
             const similar = scoredContent
                .filter(m => m.id !== lastWatchedId && m.genre?.some(g => lastWatched.genre?.includes(g)))
                .slice(0, 10);
             if (similar.length > 0) {
                 addCat('because-watched', `כי צפית ב-${lastWatched.title}`, similar);
             }
        }
    }

    // --- 5. BINGEWORTHY SERIES (TV Focus) ---
    const topSeries = scoredContent.filter(m => m.type === 'series' && !watchedHistory.includes(m.id)).slice(0, 10);
    if (topSeries.length > 0) {
        addCat('binge-series', 'סדרות שוות בינג׳', topSeries);
    }

    // --- 6. BLOCKBUSTER MOVIES (Movies Focus) ---
    const topMovies = scoredContent.filter(m => m.type === 'movie' && !watchedHistory.includes(m.id)).slice(0, 10);
    if (topMovies.length > 0) {
        addCat('hit-movies', 'סרטים שוברי קופות', topMovies);
    }

    // --- 7. TASTE BREAKERS (Algorithm) ---
    const tasteBreakers = scoredContent.filter(m => 
        (m.matchScore || 0) > 85 && 
        calculateVectorDistance(m.attributes!, userVector) > 0.5 
    ).slice(0, 10);
    if (tasteBreakers.length > 0) {
        addCat('taste-breakers', 'לצאת מאזור הנוחות', tasteBreakers);
    }

    // --- 8. GENRE FILLERS (Standard) ---
    const neededGenres = ['מדע בדיוני', 'אקשן', 'קומדיה', 'אנימציה'];
    neededGenres.forEach(genre => {
        // Skip if this genre is the main preference (already covered in top picks likely)
        if (!preferredGenres.includes(genre)) {
             const genreMovies = scoredContent.filter(m => m.genre?.includes(genre)).slice(0, 10);
             addCat(`genre-${genre}`, genre, genreMovies);
        }
    });

    return categories;
};

// --- Helpers ---

const getMoodLabel = (mood: string) => {
    const map: Record<string, string> = {
        'chill': 'רגוע וקליל ☕',
        'pumped': 'אקשן ואדרנלין 🔥',
        'smart': 'לחשוב עמוק 🧠',
        'scary': 'להיבהל קצת 👻'
    };
    return map[mood] || mood;
};

export const getPersonalizedHero = (preferredGenres: string[], watchedHistory: string[], currentMood?: string): Movie => {
    const userVector = getUserVector(preferredGenres, watchedHistory);
    
    // Get all content with backdrops
    let candidates = CONTENT_LIBRARY.filter(m => m.backdropUrl && !watchedHistory.includes(m.id));
    
    // Filter by mood
    if (currentMood) {
         if (currentMood === 'pumped') candidates = candidates.filter(m => m.attributes!.adrenaline > 0.6);
         if (currentMood === 'smart') candidates = candidates.filter(m => m.attributes!.intellect > 0.6);
         if (currentMood === 'chill') candidates = candidates.filter(m => m.attributes!.adrenaline < 0.5);
    }

    // Find closest vector match + random element for variety
    candidates = candidates.sort((a, b) => {
        const distA = calculateVectorDistance(a.attributes!, userVector);
        const distB = calculateVectorDistance(b.attributes!, userVector);
        return distA - distB;
    });

    // Return the top match, but add calculated score to it
    const bestMatch = candidates[0] || FEATURED_MOVIE;
    const score = calculateSmartScore(bestMatch, userVector, preferredGenres, 'night');
    
    return { ...bestMatch, matchScore: score };
};

export const CATEGORIES = getPersonalizedCategories([], []);
