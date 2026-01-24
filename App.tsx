
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { VideoPlayer, NextContent } from './components/VideoPlayer';
import { AISearch } from './components/AISearch';
import { ContentDetails } from './components/ContentDetails';
import { SettingsPage } from './components/SettingsPage';
import { BrowsePage } from './components/BrowsePage';
import { LoginPage } from './components/LoginPage';
import { Movie } from './types';
import { SkeletonHomePage } from './components/skeletons/SkeletonHomePage';
import { getAllContent, getPersonalizedCategories, getPersonalizedHero } from './constants';
import { Hero } from './components/Hero';
import { MovieRow } from './components/MovieRow';
import { Zap, Brain, Coffee, Ghost } from 'lucide-react';
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
    const [nextEpisode, setNextEpisode] = useState<NextContent | null>(null);
    const { user, loading: authLoading, activeProfile, updateWatchProgress, toggleMyList, toggleLikedContent, updatePreference } = useAuth();
    const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

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
                if (currentView === 'login') setCurrentView('home');
            } else {
                if (currentView !== 'login') setCurrentView('login');
            }
        }
    }, [user, authLoading, currentView]);

    const handleContentSelect = (movie: Movie) => {
        setSelectedContent(movie);
        setRecentlyViewedIds(prev => [movie.id, ...prev.filter(id => id !== movie.id)].slice(0, 10));
    };

    const parseDuration = (durStr?: string): number => {
        if (!durStr) return 0;
        const minutes = parseInt(durStr.replace(/\D/g, ''));
        return isNaN(minutes) ? 0 : minutes * 60;
    };

    const handlePlayVideo = (url: string, title: string = '') => {
        let foundMovie: Movie | null = null;
        let videoId: string | null = null;
        const all = getAllContent();

        for (const m of all) {
            if (m.videoUrl === url) { foundMovie = m; videoId = m.id; break; }
            if (m.seasons?.some(s => s.episodes.some(e => e.videoUrl === url))) { foundMovie = m; videoId = m.id; break; }
        }

        if (foundMovie) {
            videoId = foundMovie.id;
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

                        // Find next episode
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

    const handleContentPlay = (movie: Movie) => {
        if (movie.type === 'series' && movie.seasons?.[0]?.episodes?.[0]) {
            const ep = movie.seasons[0].episodes[0];
            handlePlayVideo(ep.videoUrl, `${movie.title}: ${ep.title}`);
        } else if (movie.videoUrl) {
            handlePlayVideo(movie.videoUrl, movie.title);
        }
    };

    const renderPage = () => {
        if (currentView === 'login') return <LoginPage onRegisterSuccess={() => setCurrentView('onboarding')} />;
        if (currentView === 'onboarding') return (
            <Onboarding
                onComplete={(p) => {
                    updatePreference('favoriteGenres', p);
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
            onToggleList: toggleMyList,
            onToggleLike: toggleLikedContent
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
                        const prog = activeProfile?.watchHistory[m.id];
                        return { ...m, progress: prog ? Math.floor((prog.currentTime / prog.duration) * 100) : 0 };
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
                    type="movie"
                    duration={activeVideoDuration}
                    nextItem={nextEpisode}
                    onPlayNext={(url, title) => handlePlayVideo(url, title)}
                    onProgress={(time, dur) => {
                        if (activeVideoId) updateWatchProgress(activeVideoId, { contentId: activeVideoId, currentTime: time, duration: dur, lastWatched: new Date().toISOString() });
                    }}
                />
            )}
            {selectedContent && !activeVideoUrl && (
                <ContentDetails
                    movie={selectedContent}
                    onClose={() => setSelectedContent(null)}
                    onPlay={url => handlePlayVideo(url, selectedContent.title)}
                    onSelect={handleContentSelect}
                    isAdded={activeProfile?.myList.includes(selectedContent.id) || false}
                    isLiked={activeProfile?.likedContent.includes(selectedContent.id) || false}
                    onToggleList={() => toggleMyList(selectedContent.id)}
                    onToggleLike={() => toggleLikedContent(selectedContent.id)}
                    spoilerProtection={activeProfile?.preferences.spoilerProtection}
                />
            )}
        </div>
    );
}

export default function App() {
    return <AuthProvider><AppContent /></AuthProvider>;
}
