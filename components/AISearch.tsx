import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Film, TrendingUp } from 'lucide-react';
import { Movie } from '../types';
import { getAllContent } from '../constants';
import { MovieCard } from './MovieCard';

interface AISearchProps {
  onSelect: (movie: Movie) => void;
  myListIds: string[];
  likedIds: string[];
  onToggleList: (id: string) => void;
  onToggleLike: (id: string) => void;
}

const POPULAR_TAGS = ["מדע בדיוני", "אקשן", "קומדיה", "דרמה", "סייברפאנק", "מתח"];

const sanitizeInput = (input: string) => {
    return input.replace(/[<>{}[\]()/\\]/g, '').slice(0, 50);
};

export const AISearch: React.FC<AISearchProps> = ({ 
    onSelect,
    myListIds,
    likedIds,
    onToggleList,
    onToggleLike
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
      if (!query.trim()) {
          setResults([]);
          return;
      }
      const lowerQuery = query.toLowerCase();
      const allContent = getAllContent();
      const found = allContent.filter(item => 
          item.title.toLowerCase().includes(lowerQuery) || 
          item.description.toLowerCase().includes(lowerQuery) ||
          item.genre?.some(g => g.toLowerCase().includes(lowerQuery))
      );
      setResults(found);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(sanitizeInput(e.target.value));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] pt-20 pb-12 px-4 md:px-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-white tracking-tight mb-8">חיפוש</h2>
            <div className="relative max-w-4xl mx-auto mb-8 group">
                <div className="relative bg-[#161b22] border border-white/10 rounded-2xl flex items-center p-2 group-focus-within:border-cyan-500 group-focus-within:ring-4 group-focus-within:ring-cyan-500/20 transition-all shadow-lg">
                    <Search className="w-6 h-6 text-gray-500 ml-4 mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="חפש סרטים, סדרות, ז'אנרים..."
                        className="flex-1 bg-transparent text-white text-xl placeholder-gray-600 outline-none h-12 font-medium"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="p-2 text-gray-500 hover:text-white transition">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            
            {!query && (
                <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
                    <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-bold uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" /><span>חיפושים פופולריים</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {POPULAR_TAGS.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="px-5 py-2.5 bg-[#161b22] hover:bg-[#21262d] border border-white/10 hover:border-cyan-500 rounded-xl text-[#8b949e] hover:text-white transition-all text-sm font-medium hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10"
                            >{tag}</button>
                        ))}
                    </div>
                </div>
            )}

            {query && (
                <div className="animate-slide-up">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-0">
                            {results.map((movie) => (
                                <div className="flex justify-center" key={movie.id}>
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
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-[#161b22]">
                            <p className="text-gray-400 text-xl">לא נמצאו תוצאות עבור "{query}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};