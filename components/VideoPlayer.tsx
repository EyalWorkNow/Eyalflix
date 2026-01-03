
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
    duration?: number; // Total duration in seconds
    nextItem?: NextContent | null;
    onPlayNext?: (url: string, title: string) => void;
    onComplete?: () => void; // New prop
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const QUALITIES = ['Auto', '1080p', '720p', '480p'];
const SUBTITLE_STYLES = [
    { label: 'White', color: '#fff', bg: 'rgba(0,0,0,0.5)' },
    { label: 'Yellow', color: '#fbbf24', bg: 'rgba(0,0,0,0.8)' },
    { label: 'Cyan', color: '#22d3ee', bg: 'rgba(0,0,0,0.8)' },
];

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
    onComplete
}) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    // New Features State
    const [showSettings, setShowSettings] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<'cover' | 'contain'>('contain');
    const [inactivityWarning, setInactivityWarning] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);

    // Internal State for Skip Intro & Next Up Logic
    const [simulatedTime, setSimulatedTime] = useState(0);
    const [internalUrl, setInternalUrl] = useState(videoUrl);
    const [completedTriggered, setCompletedTriggered] = useState(false); // Ensure only triggered once

    // Next Up State
    const [showNextUp, setShowNextUp] = useState(false);
    const [nextUpCancelled, setNextUpCancelled] = useState(false);
    const [autoPlayTimer, setAutoPlayTimer] = useState(30);

    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const nextUpIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize internal URL
    useEffect(() => {
        setInternalUrl(videoUrl);
        setSimulatedTime(0);
        setLoading(true);
        setShowNextUp(false);
        setNextUpCancelled(false);
        setAutoPlayTimer(30);
        setCompletedTriggered(false);
    }, [videoUrl]);

    // Handle Play Next Action
    const handlePlayNext = () => {
        if (nextItem && onPlayNext) {
            onPlayNext(nextItem.videoUrl, nextItem.title);
            setShowNextUp(false);
        }
    };

    // Handle Next Up Countdown
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

    // Inactivity Logic
    const resetInactivityTimer = () => {
        setInactivityWarning(false);
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
        if (!isPiP && !showNextUp) {
            inactivityTimeoutRef.current = setTimeout(() => {
                setInactivityWarning(true);
            }, 600000); // 10 minutes real time
        }
    };

    // Handle auto-hiding controls and cursor
    useEffect(() => {
        const handleActivity = () => {
            if (isLocked || isPiP || showNextUp) {
                setShowControls(false);
                return;
            }

            setShowControls(true);
            document.body.style.cursor = 'auto';
            resetInactivityTimer();

            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }

            controlsTimeoutRef.current = setTimeout(() => {
                if (!showSettings) {
                    setShowControls(false);
                    document.body.style.cursor = 'none'; // Hide cursor
                }
            }, 3000);
        };

        // Initial trigger
        handleActivity();

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
            document.body.style.cursor = 'auto'; // Restore cursor on unmount
        };
    }, [showSettings, isLocked, isPiP, showNextUp]);

    // Keyboard Shortcuts & TV Remote Keys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isLocked) return;

            const key = e.key;

            if (key === '?' || key === 'Help') setShowShortcuts(prev => !prev);

            if (key === 'Escape' || key === 'Back' || key === 'Backspace') {
                if (showNextUp) {
                    setShowNextUp(false); // Cancel autoplay
                    setNextUpCancelled(true);
                    if (nextUpIntervalRef.current) clearInterval(nextUpIntervalRef.current);
                }
                else if (showShortcuts) setShowShortcuts(false);
                else if (showSettings) setShowSettings(false);
                else if (document.fullscreenElement) document.exitFullscreen();
                else onClose();
            }

            // Play/Pause mapping
            if (key === ' ' || key === 'Enter' || key === 'MediaPlayPause') {
                e.preventDefault();
                if (showNextUp) handlePlayNext(); // Space/Enter confirms next up
                else iframeRef.current?.focus(); // Rudimentary play/pause via iframe focus
            }

            // Fullscreen mapping
            if (key === 'f' || key === 'F') toggleFullscreen();

            // Mute mapping
            if (key === 'm' || key === 'M' || key === 'AudioVolumeMute') toggleMute();

            // PiP mapping
            if (key === 'p' || key === 'P') togglePiP();

            // Seek Backward (Rewind Key or Left Arrow)
            if (key === 'MediaRewind' || key === 'ArrowLeft') {
                // Logic to seek back 10s would go here (requires direct player control)
                console.log('Seek Back 10s');
            }

            // Seek Forward (FastForward Key or Right Arrow)
            if (key === 'MediaFastForward' || key === 'ArrowRight') {
                // Logic to seek fwd 10s
                console.log('Seek Forward 10s');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, showSettings, showShortcuts, isLocked, isPiP, showNextUp]);

    // Simulated Time Tracking Removed (Non-functional in iframe)

    // Handle Skip Intro Visibility based on simulated time
    useEffect(() => {
        if (introStart !== undefined && introEnd !== undefined) {
            if (simulatedTime >= introStart && simulatedTime < introEnd) {
                setShowSkipIntro(true);
            } else {
                setShowSkipIntro(false);
            }
        } else {
            setShowSkipIntro(false);
        }
    }, [simulatedTime, introStart, introEnd]);

    // Perform the Skip Action
    const handleSkipIntro = () => {
        if (introEnd) {
            // Construct URL with start time to force seek
            const separator = internalUrl.includes('?') ? '&' : '?';
            let newUrl = internalUrl;
            if (newUrl.includes('start=')) {
                newUrl = newUrl.replace(/start=\d+/, `start=${introEnd}`);
            } else {
                newUrl = `${newUrl}${separator}start=${introEnd}&autoplay=1`;
            }
            setInternalUrl(newUrl);
            setSimulatedTime(introEnd);
            setShowSkipIntro(false);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const togglePiP = async () => {
        if (onTogglePiP) {
            onTogglePiP();
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
        } catch (e) {
            return '';
        }
    }, [internalUrl]);

    const containerClass = isPiP
        ? 'fixed bottom-6 left-6 z-[200] w-80 md:w-96 aspect-video rounded-xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-black/50 transition-all duration-300'
        : 'fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in overflow-hidden select-none';

    return (
        <div ref={containerRef} className={containerClass}>

            {/* Full Mode Top Bar */}
            {!isPiP && (
                <div
                    className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="flex items-center gap-6">
                        <button
                            onClick={onClose}
                            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-300 hover:scale-105 pointer-events-auto"
                            aria-label="Back"
                        >
                            <ArrowRight className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        <h2 className="text-white/90 text-xl font-bold tracking-wide drop-shadow-md select-none hidden md:block">
                            {title}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 pointer-events-auto">
                        <button
                            onClick={() => setShowShortcuts(true)}
                            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
                            title="קיצורי מקלדת"
                        >
                            <HelpCircle className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setIsLocked(!isLocked)}
                            className={`text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition ${isLocked ? 'text-red-500 bg-red-500/10' : ''}`}
                            title={isLocked ? "בטל נעילה" : "נעילת מסך"}
                        >
                            {isLocked ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            )}

            {/* PiP Mode Overlays */}
            {isPiP && (
                <div className="absolute inset-0 z-50 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 backdrop-blur-[1px]">
                    <button
                        onClick={togglePiP}
                        className="p-3 bg-black/60 rounded-full text-white hover:bg-cyan-500 hover:text-black transition-all transform hover:scale-110"
                        title="חזור למסך מלא"
                    >
                        <Maximize className="w-6 h-6" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 bg-black/60 rounded-full text-white hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                        title="סגור נגן"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Main Video Area */}
            <div className={`w-full h-full relative bg-black flex items-center justify-center transition-all duration-500 ${!isPiP && aspectRatio === 'cover' ? 'scale-110' : 'scale-100'}`}>
                {loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none bg-black">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(34,211,238,0.4)]"></div>
                        </div>
                    </div>
                )}

                {secureUrl ? (
                    <iframe
                        ref={iframeRef}
                        src={secureUrl}
                        className={`w-full h-full border-0 focus:outline-none transition-all duration-300 ${!isPiP && aspectRatio === 'cover' ? 'object-cover' : 'object-contain'}`}
                        allowFullScreen
                        allow="autoplay; encrypted-media; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
                        referrerPolicy="no-referrer"
                        onLoad={(e) => {
                            setLoading(false);
                            (e.target as HTMLIFrameElement).focus();
                        }}
                        onError={() => { setError(true); setLoading(false); }}
                        title={`Video player for ${title}`}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-[#161b22] border border-red-500/30 px-8 py-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
                            <AlertTriangle className="text-red-500 w-12 h-12" />
                            <div className="text-white text-center">
                                <p className="font-bold text-xl mb-2">שגיאת ניגון</p>
                                <p className="text-gray-400">מקור הוידאו אינו נתמך או חסום.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <button onClick={onClose} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition">
                                    חזרה
                                </button>
                                <a
                                    href={videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                                >
                                    <Monitor className="w-4 h-4" />
                                    <span>פתח בנגן חיצוני</span>
                                </a>
                                <button
                                    onClick={() => {
                                        const proxyUrl = `https://proxy.example.com/video?url=${encodeURIComponent(videoUrl)}`;
                                        setInternalUrl(proxyUrl);
                                        setError(false);
                                        setLoading(true);
                                    }}
                                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                    <span>נסה מקור חלופי</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Overlay */}

                {/* Skip Intro Logic Disabled (Requires time tracking) */}

                {/* --- NEXT UP / AUTO PLAY OVERLAY --- */}
                {showNextUp && nextItem && !isLocked && !isPiP && (
                    <div className="absolute bottom-8 right-8 z-[150] animate-slide-up origin-bottom-right">
                        <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-sm relative">
                            {/* Background Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 z-20 transition-all duration-1000 ease-linear" style={{ width: `${(autoPlayTimer / 30) * 100}%` }} />

                            <div className="relative">
                                <img src={nextItem.thumbnailUrl} alt={nextItem.title} className="w-full h-40 object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent" />

                                <div className="absolute top-3 right-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                        <span className="text-cyan-400 font-bold font-mono">{autoPlayTimer}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 relative z-10 -mt-12">
                                <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                                    {nextItem.type === 'episode' ? 'הפרק הבא' : 'המלצה לצפייה'}
                                </p>
                                <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 mb-1">{nextItem.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{nextItem.subTitle}</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handlePlayNext}
                                        autoFocus
                                        className="flex-1 bg-white hover:bg-cyan-400 text-black font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg focus:ring-4 focus:ring-cyan-500"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        <span>נגן עכשיו</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNextUp(false);
                                            setNextUpCancelled(true);
                                            if (nextUpIntervalRef.current) clearInterval(nextUpIntervalRef.current);
                                        }}
                                        className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5 focus:ring-4 focus:ring-white/30"
                                    >
                                        ביטול
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inactivity Warning Modal */}
                {inactivityWarning && !isPiP && (
                    <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#161b22] border border-white/10 p-8 rounded-2xl max-w-md text-center shadow-2xl">
                            <h3 className="text-2xl font-bold text-white mb-2">האם את/ה עדיין צופה?</h3>
                            <p className="text-gray-400 mb-6">הווידאו נעצר עקב חוסר פעילות.</p>
                            <button
                                onClick={resetInactivityTimer}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition focus:ring-4 focus:ring-cyan-500"
                                autoFocus
                            >
                                כן, המשך בצפייה
                            </button>
                        </div>
                    </div>
                )}

                {/* Shortcut Help Modal */}
                {showShortcuts && !isPiP && (
                    <div className="absolute inset-0 z-[70] bg-black/80 flex items-center justify-center backdrop-blur-sm animate-fade-in" onClick={() => setShowShortcuts(false)}>
                        <div className="bg-[#161b22] border border-white/10 p-8 rounded-2xl max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">קיצורי מקלדת</h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-gray-300">
                                <div className="flex justify-between"><span>נגן / השהה</span> <kbd className="bg-white/10 px-2 rounded">Space</kbd></div>
                                <div className="flex justify-between"><span>מסך מלא</span> <kbd className="bg-white/10 px-2 rounded">F</kbd></div>
                                <div className="flex justify-between"><span>השתק</span> <kbd className="bg-white/10 px-2 rounded">M</kbd></div>
                                <div className="flex justify-between"><span>תמונה בתמונה</span> <kbd className="bg-white/10 px-2 rounded">P</kbd></div>
                                <div className="flex justify-between"><span>דילוג 10 שניות</span> <kbd className="bg-white/10 px-2 rounded">← / →</kbd></div>
                                <div className="flex justify-between"><span>סגירה / חזור</span> <kbd className="bg-white/10 px-2 rounded">Esc</kbd></div>
                            </div>
                            <button onClick={() => setShowShortcuts(false)} className="mt-8 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold transition focus:ring-2 focus:ring-white">סגור</button>
                        </div>
                    </div>
                )}

                {/* Custom Control Bar Overlay */}
                {!isPiP && !showNextUp && (
                    <div
                        className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${showControls && !isLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <div className="max-w-5xl mx-auto flex items-center justify-end pointer-events-auto gap-4">
                            {/* SETTINGS MENU (Aspect Ratio Only) */}
                            <div className="relative">
                                <button
                                    className={`text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full focus:ring-2 focus:ring-cyan-500 ${showSettings ? 'bg-white/20 text-white' : ''}`}
                                    onClick={() => setShowSettings(!showSettings)}
                                >
                                    <Settings className="w-6 h-6" />
                                </button>

                                {showSettings && (
                                    <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-[#161b22]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-bottom">
                                        <div className="p-2 space-y-1">
                                            <div className="p-3 hover:bg-white/5 rounded-lg group cursor-pointer focus:bg-white/10" tabIndex={0} onClick={() => setAspectRatio(prev => prev === 'cover' ? 'contain' : 'cover')}>
                                                <div className="flex items-center justify-between text-sm text-gray-300 group-hover:text-white">
                                                    <div className="flex items-center gap-2"><Ratio className="w-4 h-4" /> <span>תצוגה</span></div>
                                                    <span className="font-bold text-cyan-400">{aspectRatio === 'cover' ? 'Zoom' : 'Fit'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full hidden md:block focus:ring-2 focus:ring-cyan-500" onClick={togglePiP} title="תמונה בתוך תמונה">
                                <PictureInPicture className="w-6 h-6" />
                            </button>

                            <button className="text-white/80 hover:text-white transition p-2 hover:bg-white/10 rounded-full focus:ring-2 focus:ring-cyan-500" onClick={toggleFullscreen}>
                                {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
