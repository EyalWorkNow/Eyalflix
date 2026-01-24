
import { Movie, ContentAttributes } from '../types';
import { getAllContent } from '../constants';

export const calculateContentSimilarity = (a: Movie, b: Movie): number => {
    if (a.id === b.id) return 0;

    let score = 0;

    // 1. Genre Overlap (30%)
    const aGenres = a.genre || [];
    const bGenres = b.genre || [];
    const genreOverlap = aGenres.filter(g => bGenres.includes(g)).length;
    score += (genreOverlap * 0.1);

    // 2. Attributes Matching (50%)
    if (a.attributes && b.attributes) {
        const adrDiff = Math.abs(a.attributes.adrenaline - b.attributes.adrenaline);
        const emoDiff = Math.abs(a.attributes.emotion - b.attributes.emotion);
        const intDiff = Math.abs(a.attributes.intellect - b.attributes.intellect);

        score += (1 - (adrDiff + emoDiff + intDiff) / 3) * 0.5;
    }

    // 3. Keyword Overlap (20%)
    const aKeywords = a.keywords || [];
    const bKeywords = b.keywords || [];
    const keywordOverlap = aKeywords.filter(k => bKeywords.includes(k)).length;
    score += (keywordOverlap * 0.05);

    return Math.min(score, 1);
};

export const getRecommendationsForContent = (movie: Movie, limit: number = 10): Movie[] => {
    const all = getAllContent();
    return all
        .filter(m => m.id !== movie.id)
        .map(m => ({
            movie: m,
            score: calculateContentSimilarity(movie, m)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.movie);
};

export const getPersonalizedRecommendations = (watchedHistory: string[], likedIds: string[], limit: number = 10): Movie[] => {
    const all = getAllContent();
    const seedIds = [...new Set([...watchedHistory, ...likedIds])];

    if (seedIds.length === 0) return [];

    const seedMovies = seedIds
        .map(id => all.find(m => m.id === id))
        .filter((m): m is Movie => !!m);

    const candidates = all.filter(m => !seedIds.includes(m.id));

    const scoredCandidates = candidates.map(m => {
        let maxScore = 0;
        seedMovies.forEach(seed => {
            const s = calculateContentSimilarity(seed, m);
            if (s > maxScore) maxScore = s;
        });
        return { movie: m, score: maxScore };
    });

    return scoredCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.movie);
};
