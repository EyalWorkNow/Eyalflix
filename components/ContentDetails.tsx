
import React, { useState, useEffect, useMemo } from 'react';
import { X, Play, Plus, Check, ThumbsUp, ChevronDown, User, FileText, ListVideo, EyeOff, AlertTriangle, Layers } from 'lucide-react';
import { Movie } from '../types';
import { getAllContent } from '../constants';

interface ContentDetailsProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (url: string) => void;
  onSelect: (movie: Movie) => void;
  isAdded: boolean;
  isLiked: boolean;
  onToggleList: () => void;
  onToggleLike: () => void;
  spoilerProtection?: boolean;
}

type DetailsTab = 'overview' | 'episodes' | 'cast';

export const ContentDetails: React.FC<ContentDetailsProps> = ({ 
    movie, 
    onClose, 
    onPlay, 
    onSelect,
    isAdded,
    isLiked,
    onToggleList,
    onToggleLike,
    spoilerProtection = false
}) => {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [opacity, setOpacity] = useState(0);
  const [activeTab, setActiveTab] = useState<DetailsTab>('overview');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 50);
    if (movie.type === 'series' && movie.seasons && movie.seasons.length > 0) {
        setSelectedSeasonId(movie.seasons[0].id);
        setActiveTab('episodes'); // Default to episodes for series
    }
    return () => clearTimeout(timer);
  }, [movie]);

  const currentSeason = movie.seasons?.find(s => s.id === selectedSeasonId);

  const recommendations = useMemo(() => {
      const allContent = getAllContent();
      if (!movie.genre) return allContent.slice(0, 6);
      return allContent
        .filter(item => item.id !== movie.id && item.genre?.some(g => movie.genre?.includes(g)))
        .slice(0, 6);
  }, [movie]);

  const handlePlayClick = () => {
    if (movie.type === 'movie' && movie.videoUrl) {
      onPlay(movie.videoUrl);
    } else if (movie.type === 'series' && currentSeason?.episodes[0]) {
      onPlay(currentSeason.episodes[0].videoUrl);
    }
  };

  return (
    <div 
        className="fixed inset-0 z-[100] flex items-end md:items-start justify-center overflow-y-auto bg-black md:bg-black/80 md:backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity }}
    >
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Main Container: Full screen on mobile, floating on desktop */}
      <div className="relative w-full max-w-5xl bg-[#161b22] h-full md:h-auto md:rounded-2xl md:my-10 mx-auto overflow-y-auto md:overflow-hidden animate-slide-up origin-bottom z-[101] border border-white/10 shadow-2xl shadow-black/50 scrollbar-hide">
        
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 p-3 rounded-full hover:bg-white/20 transition group focus:ring-2 focus:ring-white"
        >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="relative h-[40vh] md:h-[60vh] w-full">
            <img 
                src={movie.backdropUrl || movie.thumbnailUrl} 
                alt={movie.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-[#161b22]/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <h1 className="text-3xl md:text-5xl font-black mb-4 text-white leading-tight max-w-3xl text-shadow-md">
                    {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-2">
                     <button 
                        onClick={handlePlayClick}
                        className="flex items-center gap-3 bg-white hover:bg-cyan-50 focus:bg-cyan-50 text-black px-8 py-4 rounded-xl font-bold text-xl transition transform active:scale-95 focus:scale-105 focus:ring-4 focus:ring-white/50 w-full md:w-auto justify-center"
                        autoFocus
                    >
                        <Play className="fill-current w-7 h-7" />
                        <span>נגן</span>
                    </button>
                    <button 
                      onClick={onToggleList}
                      className={`p-4 rounded-full border-2 transition bg-white/5 focus:scale-110 focus:ring-2 focus:ring-white ${
                        isAdded
                          ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10' 
                          : 'border-gray-500 text-gray-200 hover:border-white hover:text-white'
                      }`}
                      title={isAdded ? "הסר מהרשימה שלי" : "הוסף לרשימה שלי"}
                    >
                        {isAdded ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </button>
                    <button 
                        onClick={onToggleLike}
                        className={`p-4 rounded-full border-2 transition bg-white/5 focus:scale-110 focus:ring-2 focus:ring-white ${
                            isLiked
                            ? 'border-white text-white bg-white/20'
                            : 'border-gray-500 text-gray-200 hover:border-white hover:text-white'
                        }`}
                        title="אהבתי"
                    >
                        <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>
        </div>

        {/* Info & Tabs */}
        <div className="px-6 md:px-12 py-6 bg-[#161b22] pb-20 md:pb-6">
             
             {/* Metadata line */}
             <div className="flex flex-wrap items-center gap-4 text-base font-medium text-[#8b949e] mb-8">
                <span className="text-cyan-400 font-bold">{movie.matchScore}% התאמה</span>
                <span className="text-white">{movie.year}</span>
                <span className="border border-gray-600 px-2 py-0.5 text-sm rounded-md text-gray-300">{movie.rating}</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white uppercase font-bold tracking-wider">FHD</span>
                {movie.type === 'series' && <span>{movie.seasons?.length || 1} עונות</span>}
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-8 border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 text-lg font-bold transition flex items-center gap-2 whitespace-nowrap outline-none focus:text-cyan-400 focus:border-cyan-400 ${activeTab === 'overview' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
                >
                    <FileText className="w-5 h-5" />
                    תקציר ופרטים
                </button>
                
                {movie.type === 'series' && (
                    <button 
                        onClick={() => setActiveTab('episodes')}
                        className={`pb-4 text-lg font-bold transition flex items-center gap-2 whitespace-nowrap outline-none focus:text-cyan-400 focus:border-cyan-400 ${activeTab === 'episodes' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
                    >
                        <ListVideo className="w-5 h-5" />
                        פרקים
                    </button>
                )}

                <button 
                    onClick={() => setActiveTab('cast')}
                    className={`pb-4 text-lg font-bold transition flex items-center gap-2 whitespace-nowrap outline-none focus:text-cyan-400 focus:border-cyan-400 ${activeTab === 'cast' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}
                >
                    <User className="w-5 h-5" />
                    שחקנים וצוות
                </button>
            </div>

            {/* Tab Content: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 animate-fade-in">
                    <div className="md:col-span-2 space-y-6">
                        <p className="text-xl text-[#f0f6fc] leading-relaxed font-light">
                            {movie.description}
                        </p>
                        
                        {/* New Feature: Content Advisory */}
                        {movie.contentAdvisory && movie.contentAdvisory.length > 0 && (
                             <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4 flex gap-3 items-start">
                                 <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                 <div>
                                     <h4 className="text-red-400 font-bold text-sm mb-1">מדריך הורים</h4>
                                     <div className="flex flex-wrap gap-2">
                                         {movie.contentAdvisory.map((tag, i) => (
                                             <span key={i} className="text-xs text-red-200 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                 {tag}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        )}
                    </div>
                    <div className="text-sm space-y-6 text-[#8b949e]">
                         <div>
                            <span className="block mb-2 text-gray-500 font-bold uppercase tracking-wider text-xs">ז׳אנרים</span>
                            <span className="text-gray-200 text-base">{movie.genre?.join(', ')}</span>
                         </div>
                         <div>
                            <span className="block mb-2 text-gray-500 font-bold uppercase tracking-wider text-xs">דירוג גיל</span>
                            <span className="border border-white/20 px-2 py-1 rounded text-sm text-white bg-white/5 inline-block">{movie.rating}</span>
                         </div>
                    </div>
                </div>
            )}

            {/* Tab Content: CAST */}
            {activeTab === 'cast' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
                    {movie.cast?.map((actor, idx) => (
                         <div key={idx} className="bg-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-white/10 transition cursor-default">
                             <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white shrink-0">
                                 <User className="w-6 h-6" />
                             </div>
                             <span className="font-bold text-white text-lg">{actor}</span>
                         </div>
                    )) || <p className="text-gray-500">מידע על שחקנים אינו זמין.</p>}
                </div>
            )}
        
            {/* Tab Content: EPISODES */}
            {activeTab === 'episodes' && movie.type === 'series' && movie.seasons && (
                <div className="animate-fade-in relative min-h-[300px]">
                    <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                        <h3 className="text-2xl font-bold text-white hidden md:block">פרקים</h3>
                        
                        {/* ENHANCED TV DROPDOWN UI */}
                        <div className="relative z-30 w-full md:w-auto">
                            {/* Backdrop */}
                            {isDropdownOpen && (
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                            )}
                            
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full md:w-64 flex items-center justify-between gap-4 bg-[#1e2530] border hover:bg-[#28303e] text-white px-6 py-4 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-cyan-500/50 shadow-lg ${isDropdownOpen ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-white/10'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5 text-cyan-400" />
                                    <span className="font-bold text-lg">
                                        {movie.seasons.find(s => s.id === selectedSeasonId)?.title || 'בחר עונה'}
                                    </span>
                                </div>
                                <ChevronDown 
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} 
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 md:left-0 mt-2 w-full md:w-72 bg-[#161b22]/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-20 animate-slide-up origin-top">
                                    <div className="py-2 max-h-[60vh] overflow-y-auto">
                                        {movie.seasons.map(season => (
                                            <button
                                                key={season.id}
                                                onClick={() => {
                                                    setSelectedSeasonId(season.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-right px-6 py-4 text-base font-bold transition-all flex items-center justify-between group focus:bg-white/10 focus:outline-none ${
                                                    selectedSeasonId === season.id 
                                                    ? 'bg-cyan-500/10 text-cyan-400' 
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                <span>{season.title}</span>
                                                {selectedSeasonId === season.id && (
                                                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                                                        <Check className="w-4 h-4 text-black" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="grid gap-4">
                        {currentSeason?.episodes.map(ep => (
                             <div key={ep.id} className="group flex flex-col md:flex-row gap-4 p-4 rounded-xl hover:bg-[#1e2530] focus-within:bg-[#1e2530] transition border border-transparent hover:border-white/10 cursor-pointer" onClick={() => onPlay(ep.videoUrl)}>
                                <div className="relative w-full md:w-64 aspect-video flex-none rounded-lg overflow-hidden bg-black shadow-lg">
                                    <img 
                                        src={ep.thumbnailUrl} 
                                        alt={ep.title} 
                                        className={`w-full h-full object-cover transition duration-300 ${spoilerProtection ? 'blur-md scale-110 group-hover:blur-0 group-hover:scale-100' : 'opacity-80 group-hover:opacity-100'}`} 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        {spoilerProtection && <EyeOff className="w-8 h-8 text-white/50 group-hover:hidden absolute" />}
                                        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition scale-75 group-hover:scale-100 bg-black/40 backdrop-blur-sm z-10 shadow-lg">
                                            <Play className="fill-white w-5 h-5 ml-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-xs font-bold text-white">
                                        {ep.duration}
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white text-lg font-bold group-hover:text-cyan-400 transition">{ep.number}. {ep.title}</h4>
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base line-clamp-2 group-hover:text-gray-300 transition-colors leading-relaxed">
                                        {spoilerProtection ? <span className="blur-[4px] select-none group-hover:blur-0 transition-all duration-300">{ep.description}</span> : ep.description}
                                    </p>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Similar Content */}
            <div className="pb-16 pt-8 border-t border-white/10 bg-[#161b22]">
                 <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">יכול לעניין אותך גם</h3>
                 
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-x-5 md:gap-y-8">
                     {recommendations.map((recMovie) => (
                         <div 
                             key={recMovie.id} 
                             className="group flex flex-col gap-2 md:gap-3 cursor-pointer focus:outline-none"
                             onClick={() => onSelect(recMovie)}
                             tabIndex={0}
                         >
                             <div className="relative aspect-video rounded-lg overflow-hidden bg-[#21262d] border border-white/5 group-hover:border-white/20 group-focus:border-cyan-500 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/10 group-focus:ring-2 group-focus:ring-cyan-500">
                                 <img 
                                    src={recMovie.backdropUrl || recMovie.thumbnailUrl} 
                                    alt={recMovie.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                                 />
                                 
                                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                        <Play className="w-4 h-4 md:w-5 md:h-5 fill-white text-white ml-0.5" />
                                    </div>
                                 </div>
                             </div>

                             <div className="space-y-1 px-1">
                                 <div className="flex items-center justify-between">
                                     <h4 className="text-gray-200 font-bold text-sm md:text-base group-hover:text-white transition-colors line-clamp-1">
                                         {recMovie.title}
                                     </h4>
                                 </div>

                                 <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-medium">
                                     <span className="text-cyan-400">{recMovie.matchScore}% התאמה</span>
                                     <span className="text-gray-500">{recMovie.year}</span>
                                 </div>

                                 <p className="hidden md:block text-gray-500 text-xs line-clamp-2 leading-relaxed mt-1 group-hover:text-gray-400 transition-colors">
                                     {recMovie.description}
                                 </p>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
};
