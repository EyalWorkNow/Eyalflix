
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
    if (typeof year === 'string') return parseInt(year, 10);
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
    
    // Check if this is the "New & Popular" page based on title
    const isNewAndPopular = title === "חדש ופופולרי";
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Filter content based on type
    const { filteredContent, featuredItem, categories, allGenres } = useMemo(() => {
        const all = getAllContent();
        
        let categoriesList: { id: string; title: string; movies: Movie[]; isRanked?: boolean }[] = [];
        let genresSet = new Set<string>();

        // CASE 1: New & Popular Page - Special Layout
        if (isNewAndPopular) {
            // 1. Top 10 Ranked
            const top10 = [...all].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 10);
            categoriesList.push({ id: 'top10', title: '10 המובילים בישראל היום', movies: top10, isRanked: true });

            // 2. New Releases (Year > 2023)
            const newReleases = all.filter(m => getYear(m.year) >= 2023);
            categoriesList.push({ id: 'new', title: 'חדש ב-EyalAtiaTV', movies: newReleases });

            // 3. Series Worth Binging
            const series = all.filter(m => m.type === 'series');
            if (series.length > 0) {
                 categoriesList.push({ id: 'binge', title: 'שווים בינג׳', movies: series });
            }
             
            // 4. Trending Now (Random mix for demo)
            const trending = [...all].sort((a, b) => 0.5 - Math.random()).slice(0, 8);
            categoriesList.push({ id: 'trending', title: 'כולם מדברים על זה', movies: trending });

            // Featured item for this page - The newest one
            const newest = [...all].sort((a, b) => getYear(b.year) - getYear(a.year))[0] || all[0];

            return { filteredContent: all, featuredItem: newest, categories: categoriesList, allGenres: [] };
        }

        // CASE 2: Standard Browse Page (Movies/Series)
        const filtered = contentType 
            ? all.filter(m => m.type === contentType)
            : all;

        // Collect Genres for filter pills
        filtered.forEach(m => m.genre?.forEach(g => genresSet.add(g)));

        // Filter logic based on activeFilter pill
        const displayContent = activeFilter 
            ? filtered.filter(m => m.genre?.includes(activeFilter))
            : filtered;

        // Pick a random featured item
        let featured = displayContent.length > 0 ? displayContent[0] : FEATURED_MOVIE;
        if (displayContent.length > 1) {
            const withBackdrop = displayContent.filter(m => m.backdropUrl);
            if (withBackdrop.length > 0) {
                featured = withBackdrop[Math.floor(Math.random() * withBackdrop.length)];
            }
        }

        // Dynamically create categories based on Genres
        const genreMap = new Map<string, Movie[]>();
        
        displayContent.forEach(movie => {
            movie.genre?.forEach(g => {
                if (!genreMap.has(g)) genreMap.set(g, []);
                genreMap.get(g)?.push(movie);
            });
        });

        let dynamicCats = [];
        if (activeFilter) {
             dynamicCats.push({
                 id: activeFilter,
                 title: `המובילים ב${activeFilter}`,
                 movies: displayContent,
                 isRanked: false
             });
        } else {
            dynamicCats = Array.from(genreMap.entries()).map(([genre, movies]) => ({
                id: genre,
                title: `${title ? '' : ''} ${genre}`,
                movies: movies,
                isRanked: false
            })).sort((a, b) => b.movies.length - a.movies.length);
        }

        return { filteredContent: displayContent, featuredItem: featured, categories: dynamicCats, allGenres: Array.from(genresSet) };
    }, [contentType, title, isNewAndPopular, activeFilter]);

    return (
        <div className="relative min-h-screen">
             <Hero 
                movie={featuredItem} 
                onMoreInfo={onSelect} 
                onPlay={onPlay}
                isAdded={myListIds.includes(featuredItem.id)}
                onToggleList={() => onToggleList(featuredItem.id)}
            />
            
            {/* Added pointer-events-none to main container to allow clicks to pass through the empty top padding space to Hero buttons */}
            <div className="relative z-10 space-y-8 md:space-y-16 pb-12 bg-gradient-to-b from-transparent via-[#0d1117] to-[#0d1117] -mt-16 md:-mt-32 pt-24 md:pt-48 pointer-events-none">
                
                {/* Title and Filters container (pointer-events-auto restored) */}
                <div className="px-4 md:px-12 mb-4 pointer-events-auto">
                     <div className="flex items-center gap-3 mb-6">
                        {title && showPageTitle && <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md tracking-tight">{title}</h2>}
                        {isNewAndPopular && (
                            <span className="bg-cyan-500 text-black text-xs font-black px-2 py-1 rounded rotate-3">HOT</span>
                        )}
                    </div>
                    
                    {/* Quick Filters (Pills) */}
                    {!isNewAndPopular && allGenres.length > 0 && (
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                            <button 
                                onClick={() => setActiveFilter(null)}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition border ${!activeFilter ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600 hover:border-white'}`}
                            >
                                הכל
                            </button>
                            {allGenres.map(genre => (
                                <button 
                                    key={genre}
                                    onClick={() => setActiveFilter(activeFilter === genre ? null : genre)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition border ${activeFilter === genre ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600 hover:border-white'}`}
                                >
                                    {genre}
                                </button>
                            ))}
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
                        <div className="text-center py-20 text-gray-500 text-xl">
                            לא נמצאו תכנים בקטגוריה זו.
                        </div>
                    )}

                    {/* Show a "All" row at bottom if standard view and no filter */}
                    {!isNewAndPopular && !activeFilter && filteredContent.length > 5 && (
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
