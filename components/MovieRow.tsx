import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  isRanked?: boolean;
  myListIds?: string[];
  likedIds?: string[];
  onToggleList?: (id: string) => void;
  onToggleLike?: (id: string) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({ 
    title, 
    movies, 
    onSelect, 
    isRanked = false,
    myListIds = [],
    likedIds = [],
    onToggleList,
    onToggleLike
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.9;
      
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      
      // Update scroll state after a short delay to match animation
      setTimeout(() => {
          if (rowRef.current) {
             setIsScrolled(rowRef.current.scrollLeft > 0);
          }
      }, 300);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="group/row relative px-4 md:px-12 z-0 hover:z-20 transition-all duration-300 mb-8">
      
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 hover:text-cyan-400 cursor-pointer transition w-fit flex items-center gap-2 group-hover/row:translate-x-1 duration-300">
        {title}
      </h2>

      <div className="relative group/track">
        <button 
            className={`absolute top-0 bottom-0 left-0 z-40 bg-gradient-to-r from-[#0d1117] via-[#0d1117]/80 to-transparent p-2 hidden md:group-hover/track:flex items-center justify-center w-12 transition-opacity duration-300 opacity-0 group-hover/track:opacity-100 ${!isScrolled && 'md:!hidden'}`}
            onClick={() => scroll('left')}
            aria-label="Scroll left"
        >
            <ChevronLeft className="w-8 h-8 text-white hover:scale-125 transition-transform hover:text-cyan-400" />
        </button>

        <div 
            ref={rowRef}
            onScroll={() => setIsScrolled(rowRef.current ? rowRef.current.scrollLeft > 0 : false)}
            className={`flex overflow-x-auto gap-2 md:gap-4 py-8 -my-8 px-2 scrollbar-hide scroll-smooth items-center`} 
            style={{ paddingLeft: '4px', paddingRight: '4px' }}
        >
            {isRanked && (
                 <div className="flex-none w-[40px] md:w-[60px]"></div>
            )}
            
            {movies.map((movie, index) => (
                <div key={`${movie.id}-${index}`} className="relative flex items-center flex-none">
                     {isRanked && (
                         <span className="absolute right-full mr-[-20px] md:mr-[-30px] z-0 text-[80px] md:text-[100px] font-black text-[#161b22] leading-none drop-shadow-[0_0_2px_rgba(255,255,255,0.5)] scale-y-110 tracking-tighter select-none pointer-events-none stroke-white stroke-1">
                             {index + 1}
                         </span>
                     )}
                     <MovieCard 
                        movie={movie} 
                        onSelect={onSelect} 
                        isAdded={myListIds.includes(movie.id)}
                        isLiked={likedIds.includes(movie.id)}
                        onToggleList={onToggleList}
                        onToggleLike={onToggleLike}
                    />
                </div>
            ))}
        </div>

        <button 
            className="absolute top-0 bottom-0 right-0 z-40 bg-gradient-to-l from-[#0d1117] via-[#0d1117]/80 to-transparent p-2 hidden md:group-hover/track:flex items-center justify-center w-12 transition-opacity duration-300 opacity-0 group-hover/track:opacity-100"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
        >
            <ChevronRight className="w-8 h-8 text-white hover:scale-125 transition-transform hover:text-cyan-400" />
        </button>
      </div>
    </div>
  );
};