
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, AlertTriangle, Maximize, Minimize, Volume2, VolumeX, Play, Settings, PictureInPicture, Lock, Unlock, Monitor, HelpCircle, Ratio, X } from 'lucide-react';
import { ContentType } from '../types';

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
    const [aspectRatio, setAspectRatio] = useState<'cover' | 'contain'>('contain');
    const [inactivityWarning, setInactivityWarning] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [simulatedTime, setSimulatedTime] = useState(0);
    const [internalUrl, setInternalUrl] = useState(videoUrl);
    const [completedTriggered, setCompletedTriggered] = useState(false);
    const [showNextUp, setShowNextUp] = useState(false);
    const [autoPlayTimer, setAutoPlayTimer] = useState(30);

    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const nextUpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInternalUrl(videoUrl);
        setSimulatedTime(0);
        setLoading(true);
        setShowNextUp(false);
        setAutoPlayTimer(30);
        setCompletedTriggered(false);
    }, [videoUrl]);

    const handlePlayNext = () => {
        if (nextItem && onPlayNext) {
            onPlayNext(nextItem.videoUrl, nextItem.title);
            setShowNextUp(false);
        }
    };

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
                if (!showSettings) {
                    setShowControls(false);
                    document.body.style.cursor = 'none';
                }
            }, 3000);
        };

        const progressInterval = setInterval(() => {
            if (!loading && !error && !showNextUp) {
                setSimulatedTime(prev => {
                    const newTime = prev + 1;
                    if (onProgress) onProgress(newTime, duration);
                    if (duration > 0 && newTime >= duration * 0.95 && !completedTriggered) {
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
    }, [showSettings, isLocked, isPiP, showNextUp, loading, error, duration, completedTriggered, onProgress, onComplete, nextItem]);

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
            if (!isExternal && !allowedDomains.some(domain => urlObj.hostname.endsWith(domain))) return '';
            let finalSrc = internalUrl;
            if (urlObj.hostname.includes('drive.google.com') && urlObj.pathname.includes('/view')) {
                finalSrc = internalUrl.replace('/view', '/preview');
            } else if (urlObj.pathname.includes('/shorts/')) {
                const videoId = urlObj.pathname.split('/shorts/')[1];
                if (videoId) finalSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            } else if (urlObj.searchParams.has('v')) {
                const videoId = urlObj.searchParams.get('v');
                const startParam = urlObj.searchParams.get('start');
                finalSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1${startParam ? `&start=${startParam}` : ''}`;
            } else if (urlObj.hostname === 'youtu.be') {
                const videoId = urlObj.pathname.slice(1);
                const startParam = urlObj.searchParams.get('start');
                if (videoId) finalSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1${startParam ? `&start=${startParam}` : ''}`;
            }
            return finalSrc;
        } catch (e) { return ''; }
    }, [internalUrl, isExternal]);

    const containerClass = isPiP
        ? 'fixed bottom-6 left-6 z-[200] w-80 md:w-96 aspect-video rounded-xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-black/50 transition-all duration-300'
        : 'fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in overflow-hidden select-none';

    return (
        <div ref={containerRef} className={containerClass}>
            {!isPiP && (
                <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 pointer-events-auto">
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <h2 className="text-white/90 text-xl font-bold hidden md:block">{title}</h2>
                    </div>
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <button onClick={() => setShowShortcuts(true)} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"><HelpCircle className="w-6 h-6" /></button>
                        <button onClick={() => setIsLocked(!isLocked)} className={`text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition ${isLocked ? 'text-red-500 bg-red-500/10' : ''}`}>
                            {isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            )}
            <div className={`w-full h-full relative bg-black flex items-center justify-center transition-all duration-500 ${!isPiP && aspectRatio === 'cover' ? 'scale-110' : 'scale-100'}`}>
                {loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
                        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(34,211,238,0.4)]"></div>
                    </div>
                )}
                {secureUrl ? (
                    <iframe ref={iframeRef} src={secureUrl} className="w-full h-full border-0 focus:outline-none" allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="no-referrer" onLoad={() => setLoading(false)} onError={() => { setError(true); setLoading(false); }} />
                ) : (
                    <div className="flex flex-col items-center gap-4 p-8 bg-zinc-900 rounded-2xl border border-red-500/30">
                        <AlertTriangle className="text-red-500 w-12 h-12" />
                        <h3 className="text-white text-xl font-bold">שגיאת ניגון</h3>
                        <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition">חזרה</button>
                    </div>
                )}
                {showNextUp && nextItem && !isLocked && !isPiP && (
                    <div className="absolute bottom-8 right-8 z-[150] animate-slide-up origin-bottom-right">
                        <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-sm">
                            <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 z-20 transition-all duration-1000 ease-linear" style={{ width: `${(autoPlayTimer / 30) * 100}%` }} />
                            <img src={nextItem.thumbnailUrl} alt={nextItem.title} className="w-full h-40 object-cover opacity-60" />
                            <div className="p-5 relative z-10 -mt-8">
                                <h3 className="text-white font-bold text-lg leading-tight mb-4">{nextItem.title}</h3>
                                <div className="flex gap-3">
                                    <button onClick={handlePlayNext} autoFocus className="flex-1 bg-white hover:bg-cyan-400 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg focus:ring-4 focus:ring-cyan-500"><Play className="w-4 h-4 fill-current" /> נגן עכשיו</button>
                                    <button onClick={() => setShowNextUp(false)} className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5">ביטול</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!isPiP && !showNextUp && (
                    <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls && !isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <div className="max-w-5xl mx-auto flex items-center justify-end gap-4">
                            <button onClick={() => setShowSettings(!showSettings)} className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full focus:ring-2 focus:ring-cyan-500"><Settings className="w-6 h-6" /></button>
                            <button className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full" onClick={onTogglePiP}><PictureInPicture className="w-6 h-6" /></button>
                            <button className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full" onClick={toggleFullscreen}>{isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
