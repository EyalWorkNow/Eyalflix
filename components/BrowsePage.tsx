
import React, { useMemo, useState } from 'react';
import { Hero } from './Hero';
import { MovieRow } from './MovieRow';
import { getAllContent, FEATURED_MOVIE } from '../constants';
import { Movie } from '../types';

interface BrowsePageProps {
    contentType?: 'movie' | 'series';
    title?: string;
    onSelect: (movie: Movie) => void;
    onPlay?: (movie: Movie) => void;
    myListIds: string[];
    likedIds: string[];
    onToggleList: (id: string) => void;
    onToggleLike: (id: string) => void;
    showPageTitle?: boolean;
}

const getYear = (year: string | number | undefined): number => {
    if (typeof year === 'number') return year;
    if (typeof year === 'string') return parseInt(year, 10) || 0;
    return year || 0;
};

export const BrowsePage: React.FC<BrowsePageProps> = ({
    contentType,
    title,
    onSelect,
    onPlay,
    myListIds,
    likedIds,
    onToggleList,
    onToggleLike,
    showPageTitle = true
}) => {

    const isNewAndPopular = title === "חדש ופופולרי";
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [activeYear, setActiveYear] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('score');

    const yearFilters = [
        { label: 'הכל', value: null },
        { label: '2024+', value: '2024' },
        { label: 'שנות ה-20', value: '2020' },
        { label: 'שנות ה-10', value: '2010' },
        { label: 'קלאסיקות', value: 'classic' }
    ];

    const sortOptions = [
        { label: 'התאמה', value: 'score' },
        { label: 'הכי חדש', value: 'year' },
        { label: 'הכי פופולרי', value: 'popular' }
    ];

    // Filter and Sort logic
    const { filteredContent, featuredItem, categories, allGenres } = useMemo(() => {
        const all = getAllContent();
        let genresSet = new Set<string>();

        // CASE 1: New & Popular Page - Special Layout
        if (isNewAndPopular) {
            let categoriesList: { id: string; title: string; movies: Movie[]; isRanked?: boolean }[] = [];

            // 1. Top 10 Ranked
            const top10 = [...all].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 10);
            categoriesList.push({ id: 'top10', title: '10 המובילים בישראל היום', movies: top10, isRanked: true });

            // 2. New Releases (Year >= 2023)
            const newReleases = all.filter(m => getYear(m.year) >= 2023);
            categoriesList.push({ id: 'new', title: 'חדש ב-EyalAtiaTV', movies: newReleases });

            // 3. Series Worth Binging
            const series = all.filter(m => m.type === 'series');
            if (series.length > 0) {
                categoriesList.push({ id: 'binge', title: 'שווים בינג׳', movies: series });
            }

            // 4. Trending Now
            const trending = [...all].sort((a, b) => 0.5 - Math.random()).slice(0, 8);
            categoriesList.push({ id: 'trending', title: 'כולם מדברים על זה', movies: trending });

            const newest = [...all].sort((a, b) => getYear(b.year) - getYear(a.year))[0] || all[0];
            return { filteredContent: all, featuredItem: newest, categories: categoriesList, allGenres: [] };
        }

        // CASE 2: Standard Browse Page (Movies/Series)
        let filtered = contentType
            ? all.filter(m => m.type === contentType)
            : all;

        // Collect Genres
        filtered.forEach(m => m.genre?.forEach(g => genresSet.add(g)));

        // 1. Filter by Genre
        if (activeGenre) {
            filtered = filtered.filter(m => m.genre?.includes(activeGenre));
        }

        // 2. Filter by Year
        if (activeYear) {
            filtered = filtered.filter(m => {
                const y = getYear(m.year);
                if (activeYear === '2024') return y >= 2024;
                if (activeYear === '2020') return y >= 2020 && y < 2024;
                if (activeYear === '2010') return y >= 2010 && y < 2020;
                if (activeYear === 'classic') return y < 2010 && y > 0;
                return true;
            });
        }

        // 3. Sort logic
        filtered.sort((a, b) => {
            if (sortBy === 'year') {
                return (getYear(b.year) || 0) - (getYear(a.year) || 0);
            }
            if (sortBy === 'popular') {
                return (b.matchScore || 0) - (a.matchScore || 0);
            }
            return 0;
        });

        const featured = filtered.length > 0 ? filtered[0] : FEATURED_MOVIE;

        // Dynamically create categories based on Genres
        const genreMap = new Map<string, Movie[]>();
        filtered.forEach(movie => {
            movie.genre?.forEach(g => {
                if (!genreMap.has(g)) genreMap.set(g, []);
                genreMap.get(g)?.push(movie);
            });
        });

        let dynamicCats = [];
        if (activeGenre) {
            dynamicCats.push({
                id: activeGenre,
                title: `המובילים ב${activeGenre}`,
                movies: filtered,
                isRanked: false
            });
        } else {
            dynamicCats = Array.from(genreMap.entries()).map(([genre, movies]) => ({
                id: genre,
                title: `${genre}`,
                movies: movies.slice(0, 15),
                isRanked: false
            })).sort((a, b) => b.movies.length - a.movies.length);
        }

        return { filteredContent: filtered, featuredItem: featured, categories: dynamicCats, allGenres: Array.from(genresSet) };
    }, [contentType, title, isNewAndPopular, activeGenre, activeYear, sortBy]);

    return (
        <div className="relative min-h-screen">
            <Hero
                movie={featuredItem}
                onMoreInfo={onSelect}
                onPlay={onPlay}
                isAdded={myListIds.includes(featuredItem.id)}
                onToggleList={() => onToggleList(featuredItem.id)}
            />

            <div className="relative z-10 space-y-8 md:space-y-12 pb-12 bg-gradient-to-b from-transparent via-[#0d1117] to-[#0d1117] -mt-16 md:-mt-32 pt-24 md:pt-48 pointer-events-none">

                <div className="px-4 md:px-12 mb-4 pointer-events-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            {title && showPageTitle && <h2 className="text-3xl md:text-6xl font-black text-white drop-shadow-md tracking-tight">{title}</h2>}
                            {isNewAndPopular && (
                                <span className="bg-cyan-500 text-black text-xs font-black px-2 py-1 rounded rotate-3">HOT</span>
                            )}
                        </div>

                        {!isNewAndPopular && (
                            <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                                <div className="space-y-1.5 flex-1 min-w-[150px]">
                                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest px-1">ז'אנר</label>
                                    <select
                                        value={activeGenre || ''}
                                        onChange={(e) => setActiveGenre(e.target.value || null)}
                                        className="w-full bg-[#161b22] text-white text-sm font-bold p-2.5 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                                    >
                                        <option value="">כל הז'אנרים</option>
                                        {allGenres.sort().map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5 flex-1 min-w-[150px]">
                                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest px-1">שנת יציאה</label>
                                    <div className="flex bg-[#161b22] p-1 rounded-xl border border-white/10">
                                        {yearFilters.map(yf => (
                                            <button
                                                key={yf.label}
                                                onClick={() => setActiveYear(yf.value)}
                                                className={`flex-1 text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all ${activeYear === yf.value ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                {yf.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5 min-w-[120px]">
                                    <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest px-1">מיין לפי</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full bg-[#161b22] text-white text-sm font-bold p-2.5 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                                    >
                                        {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>

                                {(activeGenre || activeYear || sortBy !== 'score') && (
                                    <button
                                        onClick={() => {
                                            setActiveGenre(null);
                                            setActiveYear(null);
                                            setSortBy('score');
                                        }}
                                        className="mt-6 text-[10px] font-black text-gray-500 hover:text-white transition-colors underline underline-offset-4 uppercase tracking-widest px-2"
                                    >
                                        איפוס הגדרות
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pointer-events-auto">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <MovieRow
                                key={cat.id}
                                title={cat.title}
                                movies={cat.movies}
                                onSelect={onSelect}
                                isRanked={cat.isRanked}
                                myListIds={myListIds}
                                likedIds={likedIds}
                                onToggleList={onToggleList}
                                onToggleLike={onToggleLike}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 text-xl">
                            לא נמצאו תכנים בקטגוריה זו.
                        </div>
                    )}

                    {!isNewAndPopular && !activeGenre && filteredContent.length > 5 && (
                        <MovieRow
                            title="כל התוכן"
                            movies={filteredContent}
                            onSelect={onSelect}
                            myListIds={myListIds}
                            likedIds={likedIds}
                            onToggleList={onToggleList}
                            onToggleLike={onToggleLike}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
