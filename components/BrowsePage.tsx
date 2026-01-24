
import React, { useMemo, useState } from 'react';
import { Hero } from './Hero';
import { MovieRow } from './MovieRow';
import { getAllContent, FEATURED_MOVIE } from '../constants';
import { Movie } from '../types';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';

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
    return 0;
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
    const [activeYearRange, setActiveYearRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('score');
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const yearFilters = [
        { label: 'הכל', value: null },
        { label: 'חדש (2024)', value: '2024' },
        { label: '2020-2023', value: '2020' },
        { label: '2010-2019', value: '2010' },
        { label: 'לפני 2010', value: 'classic' }
    ];

    const sortOptions = [
        { label: 'התאמה אישית', value: 'score' },
        { label: 'הכי חדש', value: 'year' },
        { label: 'פופולריות', value: 'popular' }
    ];

    // Filter and Sort logic
    const { featuredItem, categories, allGenres } = useMemo(() => {
        const all = getAllContent();
        let genresSet = new Set<string>();

        // New & Popular has its own logic
        if (isNewAndPopular) {
            let categoriesList: { id: string; title: string; movies: Movie[]; isRanked?: boolean }[] = [];
            const top10 = [...all].sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0)).slice(0, 10);
            categoriesList.push({ id: 'top10', title: '10 המובילים בישראל היום', movies: top10, isRanked: true });
            const newReleases = all.filter(m => getYear(m.year) >= 2023);
            categoriesList.push({ id: 'new', title: 'חדש ב-EyalAtiaTV', movies: newReleases });
            const newest = [...all].sort((a, b) => getYear(b.year) - getYear(a.year))[0] || all[0];
            return { featuredItem: newest, categories: categoriesList, allGenres: [] };
        }

        // Apply filters to ALL content first
        let masterList = contentType ? all.filter(m => m.type === contentType) : all;
        masterList.forEach(m => m.genre?.forEach(g => genresSet.add(g)));

        if (activeGenre) masterList = masterList.filter(m => m.genre?.includes(activeGenre));
        if (activeYearRange) {
            masterList = masterList.filter(m => {
                const y = getYear(m.year);
                if (activeYearRange === '2024') return y >= 2024;
                if (activeYearRange === '2020') return y >= 2020 && y < 2024;
                if (activeYearRange === '2010') return y >= 2010 && y < 2020;
                if (activeYearRange === 'classic') return y < 2010 && y > 0;
                return true;
            });
        }

        // Sorting
        masterList.sort((a, b) => {
            if (sortBy === 'year') return (getYear(b.year) || 0) - (getYear(a.year) || 0);
            if (sortBy === 'popular') return (b.popularityScore || 0) - (a.popularityScore || 0);
            return 0;
        });

        // Generate categories from the FILTERED master list
        const genreMap = new Map<string, Movie[]>();
        masterList.forEach(movie => {
            movie.genre?.forEach(g => {
                if (!genreMap.has(g)) genreMap.set(g, []);
                genreMap.get(g)?.push(movie);
            });
        });

        const dynamicCats = Array.from(genreMap.entries())
            .map(([genre, movies]) => ({
                id: genre,
                title: genre,
                movies: movies,
                isRanked: false
            }))
            .sort((a, b) => b.movies.length - a.movies.length);

        const featured = masterList.length > 0 ? masterList[0] : FEATURED_MOVIE;

        return { featuredItem: featured, categories: dynamicCats, allGenres: Array.from(genresSet).sort() };
    }, [contentType, title, isNewAndPopular, activeGenre, activeYearRange, sortBy]);

    const resetFilters = () => {
        setActiveGenre(null);
        setActiveYearRange(null);
        setSortBy('score');
    };

    return (
        <div className="relative min-h-screen">
            <Hero
                movie={featuredItem}
                onMoreInfo={onSelect}
                onPlay={onPlay}
                isAdded={myListIds.includes(featuredItem.id)}
                onToggleList={() => onToggleList(featuredItem.id)}
            />

            <div className="relative z-10 space-y-6 md:space-y-10 pb-12 bg-gradient-to-b from-transparent via-[#0d1117] to-[#0d1117] -mt-24 md:-mt-48 pt-32 md:pt-64 pointer-events-none">

                <div className="px-4 md:px-12 pointer-events-auto">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            {title && showPageTitle && <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{title}</h2>}
                            {!isNewAndPopular && (
                                <button
                                    onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isFilterExpanded ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg scale-105' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span className="text-sm font-bold">מסננים</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
                                </button>
                            )}
                        </div>

                        {!isNewAndPopular && (activeGenre || activeYearRange || sortBy !== 'score') && (
                            <button onClick={resetFilters} className="text-gray-500 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors">
                                <X className="w-3 h-3" /> איפוס הכל
                            </button>
                        )}
                    </div>

                    {/* Expandable Filter Panel */}
                    {!isNewAndPopular && isFilterExpanded && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 mb-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl animate-fade-in shadow-2xl">
                            {/* Genres */}
                            <div className="space-y-4">
                                <h4 className="text-cyan-400 text-xs font-black uppercase tracking-widest">ז'אנרים</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => setActiveGenre(null)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${!activeGenre ? 'bg-white text-black' : 'bg-[#161b22] text-gray-400 hover:text-white border border-white/5'}`}>הכל</button>
                                    {allGenres.map(g => (
                                        <button
                                            key={g}
                                            onClick={() => setActiveGenre(activeGenre === g ? null : g)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeGenre === g ? 'bg-white text-black' : 'bg-[#161b22] text-gray-400 hover:text-white border border-white/5'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Years */}
                            <div className="space-y-4">
                                <h4 className="text-cyan-400 text-xs font-black uppercase tracking-widest">תאריך יציאה</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {yearFilters.map(yf => (
                                        <button
                                            key={yf.label}
                                            onClick={() => setActiveYearRange(activeYearRange === yf.value ? null : yf.value)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition text-right ${activeYearRange === yf.value ? 'bg-white text-black' : 'bg-[#161b22] text-gray-400 hover:text-white border border-white/5'}`}
                                        >
                                            {yf.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sorting */}
                            <div className="space-y-4">
                                <h4 className="text-cyan-400 text-xs font-black uppercase tracking-widest">מיון לפי</h4>
                                <div className="flex flex-col gap-2">
                                    {sortOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSortBy(opt.value)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition text-right flex items-center justify-between ${sortBy === opt.value ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-[#161b22] text-gray-400 hover:text-white border border-white/5'}`}
                                        >
                                            {opt.label}
                                            {sortBy === opt.value && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
                        <div className="text-center py-32 border border-dashed border-white/10 mx-4 md:mx-12 rounded-3xl bg-white/5 backdrop-blur-sm">
                            <p className="text-gray-500 text-xl font-bold mb-4">לא נמצאו תכנים התואמים את המסננים שבחרת.</p>
                            <button onClick={resetFilters} className="px-6 py-2 bg-white text-black rounded-full font-black text-sm hover:scale-105 transition-transform">נקה מסננים</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
