import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, AlertTriangle, Maximize, Minimize, Volume2, VolumeX, Play, Settings, PictureInPicture, Lock, Unlock, Monitor, HelpCircle, Ratio, X, List, Volume1, Sun, SkipForward, SkipBack, ChevronLeft, Info } from 'lucide-react';
import { ContentType, Episode } from '../types';

export interface NextContent {
    type: 'episode' | 'movie';
    title: string;
    subTitle?: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: number;
}

interface VideoPlayerProps {
    videoUrl: string;
    title: string;
    onClose: () => void;
    isExternal?: boolean;
    type: ContentType;
    isPiP?: boolean;
    onTogglePiP?: () => void;
    introStart?: number;
    introEnd?: number;
    duration?: number;
    nextItem?: NextContent | null;
    episodes?: Episode[];
    currentEpisodeId?: string;
    startTime?: number;
    onPlayNext?: (url: string, title: string) => void;
    onComplete?: () => void;
    onProgress?: (currentTime: number, duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    title,
    onClose,
    isExternal,
    type,
    isPiP = false,
    onTogglePiP,
    introStart,
    introEnd,
    duration = 0,
    nextItem,
    episodes = [],
    currentEpisodeId,
    startTime = 0,
    onPlayNext,
    onComplete,
    onProgress
}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showEpisodes, setShowEpisodes] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<'cover' | 'contain'>('contain');
    const [inactivityWarning, setInactivityWarning] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [simulatedTime, setSimulatedTime] = useState(startTime);
    const [internalUrl, setInternalUrl] = useState(videoUrl);
    const [useProxy, setUseProxy] = useState(false); // Flag for proxy mode
    const [completedTriggered, setCompletedTriggered] = useState(false);
    const [showNextUp, setShowNextUp] = useState(false);
    const [autoPlayTimer, setAutoPlayTimer] = useState(30);
    const [overlayAction, setOverlayAction] = useState<{ type: 'volume' | 'brightness' | 'seek', value: string } | null>(null);

    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const nextUpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInternalUrl(videoUrl);
        setSimulatedTime(startTime);
        setLoading(true);
        setShowNextUp(false);
        setAutoPlayTimer(30);
        setCompletedTriggered(false);
    }, [videoUrl, startTime]);

    const handlePlayNext = () => {
        if (nextItem && onPlayNext) {
            onPlayNext(nextItem.videoUrl, nextItem.title);
            setShowNextUp(false);
        }
    };

    const triggerOverlay = (type: 'volume' | 'brightness' | 'seek', value: string) => {
        setOverlayAction({ type, value });
        if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
        overlayTimeoutRef.current = setTimeout(() => setOverlayAction(null), 1000);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isLocked) return;
            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    triggerOverlay('seek', 'Pause/Play');
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'm':
                    setIsMuted(prev => !prev);
                    triggerOverlay('volume', isMuted ? 'On' : 'Muted');
                    break;
                case 'l':
                    setSimulatedTime(prev => Math.min(prev + 10, duration));
                    triggerOverlay('seek', '+10s');
                    break;
                case 'j':
                    setSimulatedTime(prev => Math.max(prev - 10, 0));
                    triggerOverlay('seek', '-10s');
                    break;
                case 'escape':
                    if (showEpisodes) setShowEpisodes(false);
                    else if (showSettings) setShowSettings(false);
                    else if (showShortcuts) setShowShortcuts(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLocked, isFullscreen, isMuted, duration, showEpisodes, showSettings, showShortcuts]);

    useEffect(() => {
        if (showNextUp && nextItem) {
            if (nextUpIntervalRef.current) clearInterval(nextUpIntervalRef.current);
            nextUpIntervalRef.current = setInterval(() => {
                setAutoPlayTimer((prev) => {
                    if (prev <= 1) {
                        handlePlayNext();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (nextUpIntervalRef.current) clearInterval(nextUpIntervalRef.current);
        }
        return () => {
            if (nextUpIntervalRef.current) clearInterval(nextUpIntervalRef.current);
        };
    }, [showNextUp, nextItem]);

    useEffect(() => {
        const handleActivity = () => {
            if (isLocked || isPiP || showNextUp) {
                setShowControls(false);
                return;
            }
            setShowControls(true);
            document.body.style.cursor = 'auto';
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => {
                if (!showSettings && !showEpisodes) {
                    setShowControls(false);
                    document.body.style.cursor = 'none';
                }
            }, 3000);
        };

        const progressInterval = setInterval(() => {
            if (!loading && !error && !showNextUp) {
                setSimulatedTime(prev => {
                    const newTime = prev + 1;
                    // Throttle updates: save progress only every 10 seconds to prevent rate limiting
                    if (onProgress && newTime % 10 === 0) {
                        onProgress(newTime, duration);
                    }
                    // 90% threshold for Next Up
                    if (duration > 0 && newTime >= duration * 0.90 && !completedTriggered) {
                        setCompletedTriggered(true);
                        if (onComplete) onComplete();
                        if (nextItem) setShowNextUp(true);
                    }
                    return newTime;
                });
            }
        }, 1000);

        handleActivity();
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            clearInterval(progressInterval);
        };
    }, [showSettings, showEpisodes, isLocked, isPiP, showNextUp, loading, error, duration, completedTriggered, onProgress, onComplete, nextItem]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const secureUrl = useMemo(() => {
        try {
            if (!internalUrl) return '';
            const urlObj = new URL(internalUrl);
            if (urlObj.protocol !== 'https:') return '';

            const allowedDomains = [
                'youtube.com', 'www.youtube.com', 'youtu.be',
                'drive.google.com', 'docs.google.com',
                'strmup.cc', 'streamup.cc', 'upn.one', 'upns.pro', 'upns.live',
                'filemoon.sx', 'hglink.to', 'mega.nz', 'silkysub.com', 'mp4upload.com'
            ];

            if (!isExternal && !allowedDomains.some(domain => urlObj.hostname.endsWith(domain))) {
                // If it's not an external link and not in allowed domains, check if it's a blocked provider
                const blockedProviders = ['filemoon.sx', 'strmup.cc', 'streamup.cc', 'upn.one', 'upns.pro', 'upns.live', 'hglink.to', 'mega.nz', 'silkysub.com', 'mp4upload.com'];
                if (blockedProviders.some(domain => urlObj.hostname.includes(domain))) {
                    setIsExternalPlayer(true); // Set flag to use external player
                    return ''; // Return empty to prevent iframe from loading
                }
                return ''; // Not allowed and not a blocked provider
            }

            let finalSrc = internalUrl;

            // Google Drive: Convert /view to /preview, but DO NOT add timestamp (CSP blocks it)
            if (urlObj.hostname.includes('drive.google.com') && urlObj.pathname.includes('/view')) {
                finalSrc = internalUrl.replace('/view', '/preview');
            }
            // YouTube Shorts
            else if (urlObj.pathname.includes('/shorts/')) {
                const videoId = urlObj.pathname.split('/shorts/')[1];
                if (videoId) finalSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1${simulatedTime > 0 ? `&start=${Math.floor(simulatedTime)}` : ''}`;
            }
            // YouTube regular videos with ?v= param
            else if (urlObj.searchParams.has('v')) {
                const videoId = urlObj.searchParams.get('v');
                const startParam = urlObj.searchParams.get('start') || (simulatedTime > 0 ? Math.floor(simulatedTime) : null);
                finalSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1${startParam ? `&start=${startParam}` : ''}`;
            }
            // YouTube short links (youtu.be)
            else if (urlObj.hostname === 'youtu.be') {
                const videoId = urlObj.pathname.slice(1);
                const startParam = urlObj.searchParams.get('start') || (simulatedTime > 0 ? Math.floor(simulatedTime) : null);
                if (videoId) finalSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1${startParam ? `&start=${startParam}` : ''}`;
            }
            // Other providers: Add timestamp if resume point exists
            else if (simulatedTime > 0 && !urlObj.hostname.includes('drive.google.com')) {
                const hasQuery = urlObj.search.length > 0;
                const separator = hasQuery ? '&' : '?';
                finalSrc = `${internalUrl}${separator}start=${Math.floor(simulatedTime)}`;
            }
            return finalSrc;
        } catch (e) { return ''; }
    }, [internalUrl, isExternal, simulatedTime]);

    const containerClass = isPiP
        ? 'fixed bottom-6 left-6 z-[200] w-80 md:w-96 aspect-video rounded-xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-black/50 transition-all duration-300'
        : 'fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in overflow-hidden select-none';

    return (
        <div ref={containerRef} className={containerClass}>
            {!isPiP && (
                <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/95 via-black/50 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95 pointer-events-auto shadow-lg backdrop-blur-md">
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-white text-xl font-black hidden md:block tracking-tight">{title}</h2>
                            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest opacity-80">
                                <Monitor className="w-3 h-3" />
                                <span>Streaming HD</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pointer-events-auto">
                        <button onClick={() => setShowShortcuts(true)} className="text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-90" title="Keyboard Shortcuts"><HelpCircle className="w-6 h-6" /></button>
                        <button onClick={() => setIsLocked(!isLocked)} className={`p-3 rounded-full transition-all hover:scale-110 active:scale-90 ${isLocked ? 'text-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                            {isLocked ? <Lock className="w-6 h-6 transition-transform duration-300 scale-110" /> : <Unlock className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Overlay Feedback */}
            {overlayAction && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]">
                    <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center gap-4 animate-scale-in border border-white/10 shadow-2xl">
                        {overlayAction.type === 'volume' && <Volume2 className="w-16 h-16 text-cyan-400" />}
                        {overlayAction.type === 'brightness' && <Sun className="w-16 h-16 text-yellow-400" />}
                        {overlayAction.type === 'seek' && <SkipForward className="w-16 h-16 text-white" />}
                        <span className="text-white text-2xl font-black uppercase tracking-widest">{overlayAction.value}</span>
                    </div>
                </div>
            )}

            <div className={`w-full h-full relative bg-black flex items-center justify-center transition-all duration-700 ease-out ${!isPiP && aspectRatio === 'cover' ? 'scale-110' : 'scale-100'}`}>

                {secureUrl ? (
                    <iframe ref={iframeRef} src={secureUrl} className="w-full h-full border-0 focus:outline-none" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="origin" onLoad={() => setLoading(false)} onError={() => { setError(true); setLoading(false); }} />
                ) : (
                    <div className="flex flex-col items-center gap-6 p-12 bg-zinc-900/50 backdrop-blur-3xl rounded-[2.5rem] border border-red-500/30 shadow-2xl animate-shake">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
                            <AlertTriangle className="text-red-500 w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-white text-2xl font-black mb-2">playback_error_v1</h3>
                            <p className="text-gray-400 font-medium">המקור אינו זמין כרגע</p>
                        </div>
                        <button onClick={onClose} className="px-8 py-3 bg-white text-black hover:bg-cyan-400 hover:text-white rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl">חזרה לדף הבית</button>
                    </div>
                )}

                {/* Episodes Sidebar */}
                {showEpisodes && episodes.length > 0 && !isLocked && (
                    <div className="absolute inset-y-0 right-0 w-full md:w-96 z-[160] flex animate-slide-left">
                        <div className="flex-1 cursor-pointer" onClick={() => setShowEpisodes(false)}></div>
                        <div className="w-full md:w-96 bg-black/90 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">פרקים</h3>
                                <button onClick={() => setShowEpisodes(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-white" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                                <div className="space-y-4">
                                    {episodes.map(ep => (
                                        <button
                                            key={ep.id}
                                            onClick={() => {
                                                if (onPlayNext) onPlayNext(ep.videoUrl, `${title.split(':')[0]}: ${ep.title}`);
                                                setShowEpisodes(false);
                                            }}
                                            className={`w-full group text-right p-4 rounded-2xl transition-all duration-300 border ${currentEpisodeId === ep.id
                                                ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                                : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 hover:translate-x-[-4px]'
                                                }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-24 aspect-video flex-none rounded-lg overflow-hidden bg-black relative">
                                                    <img src={ep.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={ep.title} />
                                                    {currentEpisodeId === ep.id && <div className="absolute inset-0 flex items-center justify-center bg-cyan-500/20"><Play className="w-6 h-6 fill-cyan-400 stroke-cyan-400" /></div>}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                                    <span className={`text-xs font-black uppercase tracking-widest mb-1 ${currentEpisodeId === ep.id ? 'text-cyan-400' : 'text-gray-500'}`}>פרק {ep.number}</span>
                                                    <h4 className={`font-bold truncate ${currentEpisodeId === ep.id ? 'text-white' : 'text-gray-300'}`}>{ep.title}</h4>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Up Overlay Upgrade */}
                {showNextUp && nextItem && !isLocked && !isPiP && (
                    <div className="absolute bottom-12 right-12 z-[150] animate-slide-up origin-bottom-right">
                        <div className="bg-[#161b22]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] max-w-sm ring-1 ring-white/20">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/10 z-20">
                                <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-1000 ease-linear" style={{ width: `${(autoPlayTimer / 30) * 100}%` }} />
                            </div>
                            <div className="relative h-44">
                                <img src={nextItem.thumbnailUrl} alt={nextItem.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent" />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                                    הבא בתור ב- {autoPlayTimer} שניות
                                </div>
                            </div>
                            <div className="p-8 relative z-10 -mt-10">
                                <span className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-2 block">{nextItem.subTitle}</span>
                                <h3 className="text-white font-black text-2xl leading-tight mb-6 tracking-tight">{nextItem.title}</h3>
                                <div className="flex gap-4">
                                    <button onClick={handlePlayNext} autoFocus className="flex-[2] bg-white hover:bg-cyan-400 text-black hover:text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95 group"><Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" /> נגן עכשיו</button>
                                    <button onClick={() => setShowNextUp(false)} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 hover:border-white/20">ביטול</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isPiP && (
                    <div className={`absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${showControls && !isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
                            {/* Left Controls */}
                            <div className="flex items-center gap-4 pointer-events-auto">
                                <button className="text-white/80 hover:text-white transition-all p-3 hover:bg-white/10 rounded-2xl group active:scale-90" onClick={() => triggerOverlay('seek', '-10s')}><SkipBack className="w-7 h-7 group-hover:-rotate-12 transition-transform" /></button>
                                <button className="text-white/80 hover:text-white transition-all p-3 hover:bg-white/10 rounded-2xl group active:scale-90" onClick={() => triggerOverlay('seek', '+10s')}><SkipForward className="w-7 h-7 group-hover:rotate-12 transition-transform" /></button>
                                <div className="w-[1px] h-8 bg-white/10 mx-2"></div>
                                <button className="text-white/80 hover:text-white transition-all p-3 hover:bg-white/10 rounded-2xl flex items-center gap-3 group active:scale-90" onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <VolumeX className="w-7 h-7 text-red-500" /> : <Volume2 className="w-7 h-7 group-hover:scale-110 transition-transform" />}
                                </button>
                            </div>

                            {/* Right Controls */}
                            <div className="flex items-center gap-3 pointer-events-auto">
                                {type === 'series' && (
                                    <button onClick={() => setShowEpisodes(!showEpisodes)} className={`transition-all p-4 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest border ${showEpisodes ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'}`}>
                                        <List className="w-6 h-6" />
                                        <span className="hidden md:block">פרקים</span>
                                    </button>
                                )}
                                <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
                                <button onClick={() => setShowSettings(!showSettings)} className={`transition-all p-4 rounded-2xl hover:scale-110 active:scale-90 border ${showSettings ? 'bg-white/10 border-white/30 text-white' : 'text-white/80 hover:text-white hover:bg-white/10 border-transparent'}`}><Settings className="w-6 h-6" /></button>
                                <button className="text-white/80 hover:text-white transition-all p-4 hover:bg-white/10 rounded-2xl hover:scale-110 active:scale-90" title="Picture in Picture" onClick={onTogglePiP}><PictureInPicture className="w-6 h-6" /></button>
                                <button className="text-white/80 hover:text-white transition-all p-4 hover:bg-white/10 rounded-2xl hover:scale-110 active:scale-90" title="Full Screen" onClick={toggleFullscreen}>{isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* In-Player Settings Modal */}
            {showSettings && !isLocked && (
                <div className="absolute inset-0 z-[170] flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#161b22]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl">
                                    <Settings className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">הגדרות נגן</h3>
                            </div>
                            <button onClick={() => setShowSettings(false)} className="p-3 hover:bg-white/10 rounded-full transition-all hover:rotate-90"><X className="w-6 h-6 text-white" /></button>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Ratio className="w-6 h-6 text-gray-400" />
                                    <div>
                                        <span className="block text-white font-bold text-lg">יחס תצוגה</span>
                                        <span className="text-sm text-gray-500 font-medium">התאם את הסרטון למסך שלך</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 p-1 bg-black/50 rounded-2xl">
                                    <button onClick={() => setAspectRatio('contain')} className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${aspectRatio === 'contain' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}>REGULAR</button>
                                    <button onClick={() => setAspectRatio('cover')} className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${aspectRatio === 'cover' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}>FULL</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Monitor className="w-6 h-6 text-gray-400" />
                                    <div>
                                        <span className="block text-white font-bold text-lg">איכות צפייה</span>
                                        <span className="text-sm text-gray-500 font-medium">מותאם אוטומטית לרוחב הפס</span>
                                    </div>
                                </div>
                                <span className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl text-xs font-black ring-1 ring-cyan-500/20">AUTO 1080P</span>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-gray-500">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest tracking-widest">v2.4.0 High-Performance Engine</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shortcuts Overlay */}
            {showShortcuts && (
                <div className="absolute inset-0 z-[180] flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowShortcuts(false)}></div>
                    <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                        <h3 className="text-3xl font-black text-white mb-10 italic uppercase border-b border-white/10 pb-6 flex items-center gap-4">
                            <Monitor className="text-cyan-400" />
                            קיצורי מקלדת
                        </h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { key: 'Space / K', desc: 'נגן / השהה' },
                                { key: 'F', desc: 'מסך מלא' },
                                { key: 'M', desc: 'השתק / בטל השתקה' },
                                { key: 'L / →', desc: 'דלג 10 שניות קדימה' },
                                { key: 'J / ←', desc: 'דלג 10 שניות אחורה' },
                                { key: 'Esc', desc: 'סגור תפריטים' }
                            ].map(item => (
                                <div key={item.key} className="flex justify-between items-center group">
                                    <span className="text-gray-500 font-bold group-hover:text-gray-400 transition-colors uppercase text-sm tracking-widest">{item.desc}</span>
                                    <kbd className="bg-white/10 text-cyan-400 px-4 py-2 rounded-xl font-black min-w-[60px] text-center border border-white/10 shadow-lg">{item.key}</kbd>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowShortcuts(false)} className="mt-12 w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-cyan-400 hover:text-white transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">מעולה, הבנתי!</button>
                    </div>
                </div>
            )}
        </div>
    );
};
