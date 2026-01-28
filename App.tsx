
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { VideoPlayer, NextContent } from './components/VideoPlayer';
import { AISearch } from './components/AISearch';
import { ContentDetails } from './components/ContentDetails';
import { SettingsPage } from './components/SettingsPage';
import { BrowsePage } from './components/BrowsePage';
import { LoginPage } from './components/LoginPage';
import { Movie, Episode } from './types';
import { SkeletonHomePage } from './components/skeletons/SkeletonHomePage';
import { getAllContent, getPersonalizedCategories, getPersonalizedHero } from './constants';
import { Hero } from './components/Hero';
import { MovieRow } from './components/MovieRow';
import { Zap, Brain, Coffee, Ghost, Check, AlertTriangle } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileSelection } from './components/ProfileSelection';
import { Onboarding } from './components/Onboarding';
import { getPersonalizedRecommendations } from './services/recommendationService';

type PageView = 'home' | 'series' | 'movies' | 'new' | 'list' | 'settings' | 'search' | 'login' | 'onboarding';

function AppContent() {
    const [appLoading, setAppLoading] = useState(true);
    const [currentView, setCurrentView] = useState<PageView>('login');
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const [selectedContent, setSelectedContent] = useState<Movie | null>(null);
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
    const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const [activeVideoDuration, setActiveVideoDuration] = useState<number>(0);
    const [activeVideoType, setActiveVideoType] = useState<'movie' | 'series'>('movie');
    const [nextEpisode, setNextEpisode] = useState<NextContent | null>(null);
    const { user, loading: authLoading, activeProfile, isFirstTime, createFirstProfile, updateWatchProgress, toggleMyList, toggleLikedContent, updatePreference } = useAuth();
    const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (activeProfile) {
            setAppLoading(false);
        } else if (!authLoading && !user) {
            setAppLoading(false);
        }
    }, [activeProfile, user, authLoading]);

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                // Check if user is first-time and needs onboarding
                if (isFirstTime && currentView !== 'onboarding') {
                    setCurrentView('onboarding');
                } else if (currentView === 'login') {
                    setCurrentView('home');
                }
            } else {
                if (currentView !== 'login') setCurrentView('login');
            }
        }
    }, [user, authLoading, currentView, isFirstTime]);

    const handleContentSelect = (movie: Movie) => {
        setSelectedContent(movie);
        setRecentlyViewedIds(prev => [movie.id, ...prev.filter(id => id !== movie.id)].slice(0, 10));
    };

    const parseDuration = (durStr?: string): number => {
        if (!durStr) return 0;
        const minutes = parseInt(durStr.replace(/\D/g, ''));
        return isNaN(minutes) ? 0 : minutes * 60;
    };

    const [activeVideoEpisodes, setActiveVideoEpisodes] = useState<Episode[]>([]);

    const handlePlayVideo = (url: string, title: string = '', startTime: number = 0, context?: Movie) => {
        let foundMovie: Movie | null = context || null;
        let videoId: string | null = null;
        let episodesList: Episode[] = [];

        // If context provided, use it directly (FAST PATH)
        if (foundMovie) {
            if (foundMovie.type === 'series' && foundMovie.seasons) {
                episodesList = foundMovie.seasons.flatMap(s => s.episodes);
                // Find specific episode ID within context
                const ep = episodesList.find(e => e.videoUrl === url);
                videoId = ep ? ep.id : foundMovie.id;
            } else {
                videoId = foundMovie.id;
            }
        }
        // Fallback: Search in all content (SLOW PATH)
        else {
            const all = getAllContent();
            for (const m of all) {
                // Check finding in episodes FIRST (Deep Search)
                if (m.seasons?.some(s => s.episodes.some(e => e.videoUrl === url))) {
                    foundMovie = m;
                    episodesList = m.seasons.flatMap(s => s.episodes);
                    const ep = episodesList.find(e => e.videoUrl === url);
                    if (ep) videoId = ep.id;
                    break;
                }

                // Then check top-level match
                if (m.videoUrl === url) {
                    foundMovie = m;
                    videoId = m.id;
                    if (m.type === 'series' && m.seasons) {
                        episodesList = m.seasons.flatMap(s => s.episodes);
                    }
                    break;
                }
            }
        }

        if (foundMovie) {
            setActiveVideoEpisodes(episodesList);
            setActiveVideoType(foundMovie.type);
            let next: NextContent | null = null;

            if (foundMovie.type === 'series') {
                const seasons = foundMovie.seasons || [];
                for (let sIdx = 0; sIdx < seasons.length; sIdx++) {
                    const season = seasons[sIdx];
                    const epIdx = season.episodes.findIndex(e => e.videoUrl === url);
                    if (epIdx !== -1) {
                        const ep = season.episodes[epIdx];
                        title = `${foundMovie.title}: ${ep.title}`;
                        setActiveVideoDuration(parseDuration(ep.duration) || 3600);

                        let nextEp = season.episodes[epIdx + 1];
                        if (!nextEp && seasons[sIdx + 1]) {
                            nextEp = seasons[sIdx + 1].episodes[0];
                        }

                        if (nextEp) {
                            next = {
                                type: 'episode',
                                title: nextEp.title,
                                subTitle: foundMovie.title,
                                thumbnailUrl: nextEp.thumbnailUrl || foundMovie.thumbnailUrl,
                                videoUrl: nextEp.videoUrl,
                                duration: parseDuration(nextEp.duration) || 3600
                            };
                        }
                        break;
                    }
                }
            } else {
                setActiveVideoDuration(5400);
            }
            setNextEpisode(next);
        }

        setActiveVideoTitle(title);
        setActiveVideoUrl(url);
        setActiveVideoId(videoId);
    };

    const handleToggleList = (id: string) => {
        toggleMyList(id);
        const isAdded = activeProfile?.myList.includes(id);
        showToast(isAdded ? 'הוסר מהרשימה שלי' : 'נוסף לרשימה שלי', isAdded ? 'info' : 'success');
    };

    const handleToggleLike = (id: string) => {
        toggleLikedContent(id);
        const isLiked = activeProfile?.likedContent.includes(id);
        showToast(isLiked ? 'הלייק הוסר' : 'אהבת את התוכן!', isLiked ? 'info' : 'success');
    };

    const handleContentPlay = (movie: Movie) => {
        if (movie.type === 'series') {
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
                const prog = activeProfile?.watchHistory[targetEp.id];
                const start = prog && (prog.currentTime / prog.duration < 0.95) ? prog.currentTime : 0;
                handlePlayVideo(targetEp.videoUrl, `${movie.title}: ${targetEp.title}`, start, movie);
            }
        } else if (movie.videoUrl) {
            const prog = activeProfile?.watchHistory[movie.id];
            const start = prog && (prog.currentTime / prog.duration < 0.95) ? prog.currentTime : 0;
            handlePlayVideo(movie.videoUrl, movie.title, start, movie);
        }
    };

    const renderPage = () => {
        if (currentView === 'login') return <LoginPage onRegisterSuccess={() => setCurrentView('onboarding')} />;
        if (currentView === 'onboarding') return (
            <Onboarding
                onComplete={(data) => {
                    createFirstProfile(data.name, data.avatar, data.preferences);
                    showToast(`ברוך הבא, ${data.name}! 🎉`, 'success');
                    setCurrentView('home');
                }}
            />
        );
        if (user && !activeProfile) return <ProfileSelection />;
        if (appLoading) return <SkeletonHomePage />;

        const common = {
            onSelect: handleContentSelect,
            onPlay: handleContentPlay,
            myListIds: activeProfile?.myList || [],
            likedIds: activeProfile?.likedContent || [],
            onToggleList: handleToggleList,
            onToggleLike: handleToggleLike
        };

        switch (currentView) {
            case 'search': return <AISearch {...common} />;
            case 'settings': return <SettingsPage />;
            case 'series': return <BrowsePage contentType="series" title="סדרות אנימה" {...common} />;
            case 'movies': return <BrowsePage contentType="movie" title="סרטי אנימה" {...common} />;
            case 'new': return <BrowsePage title="חדש ופופולרי" {...common} />;
            case 'list': {
                const myListMovies = activeProfile?.myList
                    .map(id => getAllContent().find(m => m.id === id))
                    .filter((m): m is Movie => !!m) || [];

                return (
                    <div className="pt-24 md:pt-32 pb-20 p-6 md:p-12 min-h-screen">
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight">הרשימה שלי</h1>
                        {myListMovies.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {myListMovies.map(movie => (
                                    <div key={movie.id} onClick={() => handleContentSelect(movie)} className="cursor-pointer transform hover:scale-105 transition duration-300">
                                        <img src={movie.thumbnailUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg border border-white/10" />
                                        <h3 className="text-white font-bold mt-3 line-clamp-1">{movie.title}</h3>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-gray-500">
                                <p className="text-2xl font-bold mb-4">הרשימה שלך ריקה</p>
                                <button onClick={() => setCurrentView('home')} className="text-cyan-400 hover:underline">גלה תכנים חדשים</button>
                            </div>
                        )}
                    </div>
                );
            }
            case 'home':
            default:
                const watchedHistoryIds = activeProfile ? Object.keys(activeProfile.watchHistory) : [];
                const favGenres = activeProfile?.preferences.favoriteGenres || [];
                const categories = getPersonalizedCategories(favGenres, watchedHistoryIds, currentMood as string);
                const hero = getPersonalizedHero(favGenres, watchedHistoryIds, currentMood as string);
                const recs = getPersonalizedRecommendations(watchedHistoryIds, activeProfile?.likedContent || [], 10);

                const continueWatching = recentlyViewedIds
                    .map(id => getAllContent().find(m => m.id === id))
                    .filter((m): m is Movie => !!m)
                    .map(m => {
                        let finalProgress = 0;
                        if (m.type === 'series') {
                            let latestDate = 0;
                            m.seasons?.forEach(s => s.episodes.forEach(e => {
                                const p = activeProfile?.watchHistory[e.id];
                                if (p) {
                                    const d = new Date(p.lastWatched).getTime();
                                    if (d > latestDate) {
                                        latestDate = d;
                                        finalProgress = Math.floor((p.currentTime / p.duration) * 100);
                                    }
                                }
                            }));
                        } else {
                            const prog = activeProfile?.watchHistory[m.id];
                            finalProgress = prog ? Math.floor((prog.currentTime / prog.duration) * 100) : 0;
                        }
                        return { ...m, progress: finalProgress };
                    });

                return (
                    <main>
                        <Hero movie={hero} onMoreInfo={handleContentSelect} onPlay={handleContentPlay} />
                        <div className="space-y-12 pb-12 bg-[#0d1117]">
                            {continueWatching.length > 0 && <MovieRow title="המשך צפייה" movies={continueWatching} {...common} />}
                            {recs.length > 0 && <MovieRow title="במיוחד בשבילך" movies={recs} {...common} />}
                            {categories.map(c => <MovieRow key={c.id} title={c.title} movies={c.movies} {...common} />)}
                        </div>
                    </main>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <Navbar activePage={currentView} onNavigate={p => setCurrentView(p as PageView)} />
            {renderPage()}
            {activeVideoUrl && (
                <VideoPlayer
                    videoUrl={activeVideoUrl} title={activeVideoTitle}
                    onClose={() => setActiveVideoUrl(null)}
                    type={activeVideoType}
                    duration={activeVideoDuration}
                    nextItem={nextEpisode}
                    episodes={activeVideoEpisodes}
                    currentEpisodeId={activeVideoId || undefined}
                    startTime={activeVideoId ? activeProfile?.watchHistory[activeVideoId]?.currentTime : 0}
                    onPlayNext={(url, title) => handlePlayVideo(url, title)}
                    onProgress={(time, dur) => {
                        if (activeVideoId && dur > 0) {
                            updateWatchProgress(activeVideoId, {
                                contentId: activeVideoId,
                                currentTime: time,
                                duration: dur,
                                lastWatched: new Date().toISOString()
                            });
                        }
                    }}
                />
            )}
            {selectedContent && !activeVideoUrl && (
                <ContentDetails
                    movie={selectedContent}
                    onClose={() => setSelectedContent(null)}
                    onPlay={(url, context) => handlePlayVideo(url, selectedContent.title, 0, context)}
                    onSelect={handleContentSelect}
                    isAdded={activeProfile?.myList.includes(selectedContent.id) || false}
                    isLiked={activeProfile?.likedContent.includes(selectedContent.id) || false}
                    onToggleList={() => handleToggleList(selectedContent.id)}
                    onToggleLike={() => handleToggleLike(selectedContent.id)}
                    spoilerProtection={activeProfile?.preferences.spoilerProtection}
                />
            )}

            {/* Toast System Rendering */}
            {toast && (
                <div className={`fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10 animate-slide-up ${toast.type === 'success' ? 'bg-cyan-500/20 text-cyan-400' : toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}`}>
                    {toast.type === 'success' && <Check className="w-5 h-5" />}
                    {toast.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                    <span className="font-bold text-lg">{toast.message}</span>
                </div>
            )}
        </div>
    );
}

export default function App() {
    return <AuthProvider><AppContent /></AuthProvider>;
}
