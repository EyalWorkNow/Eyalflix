
import React, { useState } from 'react';
import { Play, Plus, ThumbsUp, Check } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  isAdded?: boolean;
  isLiked?: boolean;
  onToggleList?: (id: string) => void;
  onToggleLike?: (id: string) => void;
  rank?: number; 
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
    movie, 
    onSelect, 
    isAdded = false, 
    isLiked = false, 
    onToggleList, 
    onToggleLike,
    rank
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasProgress = movie.progress !== undefined && movie.progress > 0;

  const handleToggleList = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (onToggleList) onToggleList(movie.id);
  };

  const handleToggleLike = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (onToggleLike) onToggleLike(movie.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          onSelect(movie);
      }
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
      e.target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
      });
  };

  return (
    <div 
      className="relative flex-none w-[160px] md:w-[240px] aspect-[16/9] mx-2 my-2 cursor-pointer group z-10 hover:z-50 focus:z-50 transition-all duration-300 outline-none"
      onClick={() => onSelect(movie)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      role="button"
      aria-label={`Play ${movie.title}`}
    >
      {/* Base Card (Normal State) */}
      <div className={`w-full h-full rounded-2xl overflow-hidden bg-[#161b22] relative transition-all duration-300 group-hover:scale-125 group-focus:scale-125 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-focus:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:ring-2 group-focus:ring-2 group-hover:ring-cyan-500/50 group-focus:ring-cyan-500/50 ${rank ? 'ml-6' : ''}`}>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer group-focus:animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </div>

        {/* Top 10 Visual Badge on Card */}
        {rank && rank <= 3 && (
             <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-transparent text-black font-black px-3 py-1 text-xs z-30 rounded-bl-lg shadow-md">
                 TOP {rank}
             </div>
        )}

        <img
          src={movie.backdropUrl || movie.thumbnailUrl} 
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
        
        {!isLoaded && (
            <div className="absolute inset-0 bg-[#161b22] animate-pulse" />
        )}

        {/* Progress Bar */}
        {hasProgress && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/50 group-hover:hidden group-focus:hidden z-10">
                <div 
                    className="h-full bg-cyan-500"
                    style={{ width: `${movie.progress}%`}}
                />
            </div>
        )}

        {/* HOVER/FOCUS OVERLAY (Aurora UI) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            
            <div className="flex items-center gap-2 mb-3 transform translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-300 delay-75">
                <button 
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-cyan-400 focus:bg-cyan-400 transition-all hover:scale-110 shadow-lg"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(movie);
                    }}
                    tabIndex={0}
                >
                    <Play className="w-4 h-4 fill-current" />
                </button>
                <button 
                    onClick={handleToggleList}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 backdrop-blur-sm ${
                        isAdded 
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' 
                        : 'border-gray-400 text-white hover:border-white hover:bg-white/10'
                    }`}
                    title={isAdded ? "הסר מהרשימה" : "הוסף לרשימה"}
                    tabIndex={0}
                >
                    {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
                <button 
                    onClick={handleToggleLike}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 ml-auto backdrop-blur-sm ${
                        isLiked
                        ? 'border-white bg-white/20 text-white'
                        : 'border-gray-400 text-white hover:border-white hover:bg-white/10'
                    }`}
                    title={isLiked ? "בטל לייק" : "לייק"}
                    tabIndex={0}
                >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Metadata Info */}
            <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-300 delay-100">
                <h3 className="font-bold text-white text-sm md:text-base leading-tight drop-shadow-md line-clamp-1">
                    {movie.title}
                </h3>
                
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-gray-300">
                    <span className="text-cyan-400 font-bold">{movie.matchScore}% התאמה</span>
                    <span className="border border-white/20 px-1 rounded text-[9px] bg-black/50 backdrop-blur-sm">{movie.rating}</span>
                    <span>{movie.year}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                    {movie.genre?.slice(0, 3).map((g, i) => (
                        <span key={i} className="text-[10px] text-gray-400 flex items-center">
                            {g}
                            {i < (movie.genre?.length || 0) - 1 && i < 2 && <span className="mx-1 text-gray-600">•</span>}
                        </span>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
