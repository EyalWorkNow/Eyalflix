
import React, { useState, useEffect, useMemo } from 'react';
import { X, Play, Plus, Check, ThumbsUp, ChevronDown, User, FileText, ListVideo, EyeOff, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import { Movie } from '../types';
import { getAllContent } from '../constants';
import { useAuth } from '../context/AuthContext';
import { calculateContentSimilarity } from '../services/recommendationService';

interface ContentDetailsProps {
    movie: Movie;
    onClose: () => void;
    onPlay: (url: string, context?: Movie) => void;
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
    const { activeProfile, updateWatchProgress } = useAuth();
    const watchHistory = activeProfile?.watchHistory || {};

    useEffect(() => {
        const timer = setTimeout(() => setOpacity(1), 50);
        if (movie.type === 'series' && movie.seasons && movie.seasons.length > 0) {
            // Find last watched season
            let lastSeasonId = movie.seasons[0].id;
            let latestWatchedDate = 0;
            movie.seasons.forEach(s => {
                s.episodes.forEach(e => {
                    const prog = watchHistory[e.id];
                    if (prog) {
                        const date = new Date(prog.lastWatched).getTime();
                        if (date > latestWatchedDate) {
                            latestWatchedDate = date;
                            lastSeasonId = s.id;
                        }
                    }
                });
            });
            setSelectedSeasonId(lastSeasonId);
            setActiveTab('episodes');
        }
        return () => clearTimeout(timer);
    }, [movie]);

    const currentSeason = movie.seasons?.find(s => s.id === selectedSeasonId);

    const recommendations = useMemo(() => {
        const allContent = getAllContent();
        return allContent
            .filter(item => item.id !== movie.id)
            .map(item => ({
                item,
                score: calculateContentSimilarity(movie, item)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map(res => res.item);
    }, [movie]);

    const handlePlayClick = () => {
        if (movie.type === 'movie' && movie.videoUrl) {
            onPlay(movie.videoUrl, movie);
        } else if (movie.type === 'series') {
            const progressKeys = activeProfile ? Object.keys(activeProfile.watchHistory) : [];
            let lastEp: string | null = null;
            let latestWatchedDate = 0;

            movie.seasons?.forEach(s => {
                s.episodes.forEach(e => {
                    const prog = activeProfile?.watchHistory[e.id];
                    if (prog) {
                        const date = new Date(prog.lastWatched).getTime();
                        if (date > latestWatchedDate) {
                            latestWatchedDate = date;
                            lastEp = e.id;
                        }
                    }
                });
            });

            const targetEp = lastEp
                ? movie.seasons?.flatMap(s => s.episodes).find(e => e.id === lastEp)
                : movie.seasons?.[0]?.episodes?.[0];

            if (targetEp) {
                onPlay(targetEp.videoUrl, movie);
            }
        }
    };

    const toggleWatched = (episodeId: string, durationStr: string, forceWatched?: boolean) => {
        const prog = watchHistory[episodeId];
        const duration = parseInt(durationStr.replace(/\D/g, '')) * 60 || 1440;
        const isCurrentlyWatched = prog && (prog.currentTime / prog.duration > 0.9);
        const shouldBeWatched = forceWatched !== undefined ? forceWatched : !isCurrentlyWatched;

        updateWatchProgress(episodeId, {
            contentId: episodeId,
            currentTime: shouldBeWatched ? duration : 0,
            duration: duration,
            lastWatched: new Date().toISOString()
        });
    };

    const markSeasonWatched = (seasonId: string) => {
        const season = movie.seasons?.find(s => s.id === seasonId);
        if (season) {
            season.episodes.forEach(ep => toggleWatched(ep.id, ep.duration, true));
        }
    };

    const hasProgress = useMemo(() => {
        if (movie.type === 'movie') {
            const prog = watchHistory[movie.id];
            return prog && (prog.currentTime / prog.duration > 0.05) && (prog.currentTime / prog.duration < 0.9);
        } else {
            return movie.seasons?.some(s => s.episodes.some(e => {
                const prog = watchHistory[e.id];
                return prog && (prog.currentTime / prog.duration > 0.05) && (prog.currentTime / prog.duration < 0.9);
            }));
        }
    }, [movie, watchHistory]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end md:items-start justify-center overflow-y-auto bg-black md:bg-black/80 md:backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity }}
        >
            <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

            <div className="relative w-full max-w-5xl bg-[#161b22] h-full md:h-auto md:rounded-3xl md:my-10 mx-auto overflow-y-auto md:overflow-hidden animate-slide-up origin-bottom z-[101] border border-white/10 shadow-2xl shadow-black/80 scrollbar-hide">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-black/60 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition group focus:ring-2 focus:ring-cyan-500"
                >
                    <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative h-[35vh] md:h-[55vh] w-full overflow-hidden">
                    <img
                        src={movie.backdropUrl || movie.thumbnailUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-[#161b22]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#161b22]/60 via-transparent to-transparent hidden md:block" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
                        <div className="flex flex-col gap-2 mb-6">
                            <span className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xs md:text-sm">Eyalflix Original</span>
                            <h1 className="text-3xl md:text-6xl font-black text-white leading-[1.1] max-w-3xl drop-shadow-2xl italic tracking-tighter">
                                {movie.title}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={handlePlayClick}
                                className="flex items-center gap-4 bg-white hover:bg-cyan-400 focus:bg-cyan-400 text-black hover:text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl hover:scale-105 active:scale-95 w-full md:w-auto justify-center group"
                                autoFocus
                            >
                                <Play className="fill-current w-6 h-6 transition-transform group-hover:scale-110" />
                                <span>{hasProgress ? 'המשך צפייה' : 'נגן עכשיו'}</span>
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onToggleList}
                                    className={`p-5 rounded-2xl border-2 transition-all bg-white/5 hover:scale-110 active:scale-90 ${isAdded
                                        ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                        : 'border-white/20 text-white hover:border-white hover:bg-white/10'
                                        }`}
                                    title={isAdded ? "הסר מהרשימה שלי" : "הוסף לרשימה שלי"}
                                >
                                    {isAdded ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                </button>
                                <button
                                    onClick={onToggleLike}
                                    className={`p-5 rounded-2xl border-2 transition-all bg-white/5 hover:scale-110 active:scale-90 ${isLiked
                                        ? 'border-white text-white bg-white/20 shadow-xl'
                                        : 'border-white/20 text-white hover:border-white hover:bg-white/10'
                                        }`}
                                    title="אהבתי"
                                >
                                    <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 md:px-14 py-8 bg-[#161b22]">
                    <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-400 mb-10 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-2 text-cyan-400">
                            <span className="text-lg">★</span>
                            <span>{movie.matchScore}% התאמה</span>
                        </div>
                        <span className="text-gray-200">{movie.year}</span>
                        <span className="border-2 border-gray-600 px-3 py-0.5 rounded-lg text-xs text-gray-300 font-black">{movie.rating}</span>
                        <span className="bg-cyan-500/10 text-cyan-400 px-3 py-0.5 rounded-lg text-[10px] font-black tracking-widest ring-1 ring-cyan-500/20">4K ULTRA HD</span>
                        {movie.type === 'series' && <span className="text-gray-200">{movie.seasons?.length || 1} עונות</span>}
                        <div className="flex gap-2">
                            {movie.genre?.slice(0, 3).map(g => (
                                <span key={g} className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-400 uppercase tracking-tighter hover:text-white transition-colors underline decoration-cyan-500/30 underline-offset-4">{g}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-10 mb-10 overflow-x-auto scrollbar-hide no-scrollbar">
                        {[
                            { id: 'overview', label: 'סקירה', icon: FileText },
                            ...(movie.type === 'series' ? [{ id: 'episodes', label: 'פרקים', icon: ListVideo }] : []),
                            { id: 'cast', label: 'יוצרים', icon: User }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as DetailsTab)}
                                className={`pb-4 text-xl font-black transition-all flex items-center gap-3 whitespace-nowrap outline-none relative ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-cyan-400' : ''}`} />
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-scale-x" />}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-fade-in">
                                <div className="md:col-span-2 space-y-8">
                                    <p className="text-xl md:text-2xl text-gray-200 leading-[1.6] font-medium tracking-tight">
                                        {movie.description}
                                    </p>

                                    {movie.contentAdvisory && movie.contentAdvisory.length > 0 && (
                                        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-3xl p-6 flex gap-4 items-start shadow-inner">
                                            <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                                            <div>
                                                <h4 className="text-yellow-500 font-black text-xs uppercase tracking-[0.2em] mb-2">Content Advisory</h4>
                                                <div className="flex flex-wrap gap-3">
                                                    {movie.contentAdvisory.map((tag, i) => (
                                                        <span key={i} className="text-sm text-gray-300 font-bold bg-white/5 px-3 py-1 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-8">
                                    <div className="bg-white/5 p-8 rounded-3xl space-y-8 border border-white/5">
                                        <div>
                                            <span className="block mb-3 text-cyan-400 font-black uppercase tracking-widest text-[10px]">ז׳אנרים נבחרים</span>
                                            <div className="flex flex-wrap gap-2">
                                                {movie.genre?.map(g => (
                                                    <span key={g} className="text-sm font-bold text-gray-200">{g}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-white/5">
                                            <span className="block mb-3 text-cyan-400 font-black uppercase tracking-widest text-[10px]">דירוג בשירות</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-black text-white">{movie.rating}</span>
                                                <span className="text-xs text-gray-500 font-medium">Global TV Standard</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'cast' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-fade-in">
                                {movie.cast?.map((actor, idx) => (
                                    <div key={idx} className="bg-white/5 p-6 rounded-3xl group flex flex-col items-center gap-4 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 hover:-translate-y-2">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-white ring-2 ring-white/10 group-hover:ring-cyan-500/50 transition-all">
                                            <User className="w-10 h-10 opacity-50 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                                        </div>
                                        <span className="font-black text-white text-lg text-center tracking-tighter italic">{actor}</span>
                                    </div>
                                )) || <p className="text-gray-500">מידע אינו זמין.</p>}
                            </div>
                        )}

                        {activeTab === 'episodes' && movie.type === 'series' && movie.seasons && (
                            <div className="animate-fade-in space-y-10">
                                <div className="flex flex-wrap items-center justify-between gap-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <div className="relative z-30 flex-1 md:flex-none">
                                        {isDropdownOpen && <div className="fixed inset-0" onClick={() => setIsDropdownOpen(false)} />}
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`w-full md:w-80 flex items-center justify-between gap-4 bg-zinc-900 border text-white px-8 py-5 rounded-2xl transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-cyan-500/30 ${isDropdownOpen ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'border-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Layers className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                                                <span className="font-black text-xl italic tracking-tighter uppercase">
                                                    {movie.seasons.find(s => s.id === selectedSeasonId)?.title || 'בחר עונה'}
                                                </span>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-4 w-full md:w-96 bg-[#161b22] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden z-[40] animate-slide-up origin-top p-2">
                                                <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
                                                    {movie.seasons.map(season => (
                                                        <button
                                                            key={season.id}
                                                            onClick={() => {
                                                                setSelectedSeasonId(season.id);
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-right px-8 py-5 text-lg font-black italic transition-all flex items-center justify-between group rounded-2xl ${selectedSeasonId === season.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                                        >
                                                            <span>{season.title}</span>
                                                            {selectedSeasonId === season.id && <CheckCircle2 className="w-6 h-6" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => markSeasonWatched(selectedSeasonId)} className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 font-black text-sm transition-all border border-transparent hover:border-cyan-500/30">
                                        <CheckCircle2 className="w-5 h-5" />
                                        סמן הכל כנצפה
                                    </button>
                                </div>

                                <div className="grid gap-6">
                                    {currentSeason?.episodes.map(ep => {
                                        const prog = watchHistory[ep.id];
                                        const isFinished = prog && (prog.currentTime / prog.duration > 0.9);
                                        return (
                                            <div key={ep.id} className="group flex flex-col md:flex-row gap-8 p-6 rounded-[2rem] hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                                                <div className="relative w-full md:w-80 aspect-video flex-none rounded-2xl overflow-hidden bg-black shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" onClick={() => onPlay(ep.videoUrl, movie)}>
                                                    <img
                                                        src={ep.thumbnailUrl?.startsWith('http') ? ep.thumbnailUrl : (movie.backdropUrl || movie.thumbnailUrl)}
                                                        alt={ep.title}
                                                        className={`w-full h-full object-cover transition duration-700 ${spoilerProtection ? 'blur-2xl scale-125 group-hover:blur-0 group-hover:scale-100' : 'opacity-70 group-hover:opacity-100'}`}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        {spoilerProtection && <EyeOff className="w-10 h-10 text-white/40 group-hover:opacity-0 transition-opacity" />}
                                                        <div className="w-16 h-16 rounded-3xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-2xl group-hover:rotate-[360deg] duration-700">
                                                            <Play className="fill-white w-6 h-6 ml-1" />
                                                        </div>
                                                    </div>

                                                    {prog && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                                                            <div
                                                                className={`h-full transition-all duration-300 ${isFinished ? 'bg-cyan-500' : 'bg-white font-bold'}`}
                                                                style={{ width: `${Math.floor((prog.currentTime / prog.duration) * 100)}%` }}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white tracking-widest">{ep.duration}</div>
                                                </div>

                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                    <div className="flex justify-between items-center mb-4 gap-4">
                                                        <div>
                                                            <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-[10px] block mb-1">Episode {ep.number}</span>
                                                            <h4 className="text-white text-2xl font-black group-hover:text-cyan-400 transition italic tracking-tighter truncate">{ep.title}</h4>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleWatched(ep.id, ep.duration); }}
                                                            className={`p-4 rounded-2xl transition-all hover:scale-110 active:scale-95 border-2 ${isFinished ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white'}`}
                                                        >
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-400 text-base md:text-lg line-clamp-2 leading-relaxed font-medium">
                                                        {spoilerProtection ? <span className="blur-md select-none group-hover:blur-0 transition-all duration-700">{ep.description}</span> : ep.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pb-20 pt-16 border-t border-white/5 bg-[#161b22]">
                        <h3 className="text-2xl md:text-3xl font-black mb-10 text-white italic tracking-tighter uppercase flex items-center gap-4">
                            <Layers className="text-cyan-400" />
                            יכול לעניין אותך גם
                        </h3>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                            {recommendations.map((recMovie) => (
                                <div
                                    key={recMovie.id}
                                    className="group flex flex-col gap-5 cursor-pointer focus:outline-none"
                                    onClick={() => onSelect(recMovie)}
                                >
                                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-2">
                                        <img
                                            src={recMovie.backdropUrl || recMovie.thumbnailUrl}
                                            alt={recMovie.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                                                <Play className="w-6 h-6 fill-black ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 px-2">
                                        <h4 className="text-white font-black text-xl italic tracking-tighter group-hover:text-cyan-400 transition-colors line-clamp-1 uppercase">
                                            {recMovie.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span className="text-cyan-400">{recMovie.matchScore}% Match</span>
                                            <span>•</span>
                                            <span>{recMovie.year}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
