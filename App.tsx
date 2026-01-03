
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
import { getAllContent, getPersonalizedCategories, getPersonalizedHero, ExtendedCategory } from './constants';
import { Hero } from './components/Hero';
import { MovieRow } from './components/MovieRow';
import { MovieCard } from './components/MovieCard';
import { CheckCircle2, Zap, Brain, Coffee, Ghost, List, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileGate } from './components/ProfileGate';
import { Onboarding } from './components/Onboarding';

type PageView = 'home' | 'series' | 'movies' | 'new' | 'list' | 'settings' | 'search' | 'login' | 'onboarding';

function AppContent() {
    // UI Loading (Skeleton) state
    const [appLoading, setAppLoading] = useState(true);

    // Start with 'login' as the default view
    const [currentView, setCurrentView] = useState<PageView>('login');

    // Profile State
    const [currentProfile, setCurrentProfile] = useState<string | null>(null);

    // Personalization State
    const [userPreferences, setUserPreferences] = useState<string[]>([]);
    const [watchedHistory, setWatchedHistory] = useState<string[]>([]); // New: Track completed items
    const [currentMood, setCurrentMood] = useState<string | null>(null);

    const [selectedContent, setSelectedContent] = useState<Movie | null>(null);
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
    const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null); // New: Track ID for completion

    // Player Logic State
    const [activeVideoIntroStart, setActiveVideoIntroStart] = useState<number | undefined>(undefined);
    const [activeVideoIntroEnd, setActiveVideoIntroEnd] = useState<number | undefined>(undefined);
    const [activeVideoDuration, setActiveVideoDuration] = useState<number>(0);
    const [nextUpContent, setNextUpContent] = useState<NextContent | null>(null);

    // Auth state
    const { user, loading: authLoading } = useAuth();

    // PiP / Mini Player State
    const [isPiP, setIsPiP] = useState(false);

    // User Preferences State
    const [myList, setMyList] = useState<string[]>([]);
    const [likedContent, setLikedContent] = useState<string[]>([]);
    const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
    const [spoilerProtection, setSpoilerProtection] = useState(false);

    // UI State
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const moods = [
        { id: 'pumped', icon: Zap, label: 'אקשן' },
        { id: 'chill', icon: Coffee, label: 'רגוע' },
        { id: 'smart', icon: Brain, label: 'חוכמה' },
        { id: 'scary', icon: Ghost, label: 'פחד' },
    ];

    useEffect(() => {
        // Simulate initial data fetch for skeleton loading screen
        const timer = setTimeout(() => {
            setAppLoading(false);
            // Load preferences from local storage
            const savedPrefs = localStorage.getItem('eyalatiatv_preferences');
            if (savedPrefs) {
                try {
                    const parsed = JSON.parse(savedPrefs);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setUserPreferences(parsed);
                    }
                } catch (e) { }
            }

            // Load watch history
            const savedHistory = localStorage.getItem('eyalatiatv_history');
            if (savedHistory) {
                try {
                    const parsed = JSON.parse(savedHistory);
                    if (Array.isArray(parsed)) setWatchedHistory(parsed);
                } catch (e) { }
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // TV Remote Navigation Handler (Back Button)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Map Escape and Backspace to "Back" function
            if (e.key === 'Escape' || e.key === 'Backspace') {
                if (activeVideoUrl && !isPiP) {
                    // Player is open -> handled by Player component usually, but if not captured:
                    handleClosePlayer();
                } else if (selectedContent) {
                    // Modal is open -> close it
                    handleCloseDetails();
                } else if (currentView !== 'home' && user && currentProfile) {
                    // If on another page -> go Home
                    setCurrentView('home');
                } else if (currentMood) {
                    // If filter active -> clear it
                    handleMoodChange(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeVideoUrl, isPiP, selectedContent, currentView, user, currentProfile, currentMood]);

    // Auth Redirect Logic
    useEffect(() => {
        // Only run this logic when auth finished loading
        if (!authLoading) {
            if (user) {
                if (currentView === 'login') {
                    setCurrentView('home');
                }
            } else {
                if (currentView !== 'login') {
                    setCurrentView('login');
                    setCurrentProfile(null);
                }
            }
        }
    }, [user, authLoading, currentView]);

    useEffect(() => {
        if ((activeVideoUrl && !isPiP) || (selectedContent && !activeVideoUrl) || (user && !currentProfile && currentView !== 'login' && currentView !== 'onboarding') || currentView === 'onboarding') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedContent, activeVideoUrl, isPiP, user, currentProfile, currentView]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    // Toast Timer
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
    };

    const handleProfileSelect = (profileId: string) => {
        setCurrentProfile(profileId);
        showToast(`ברוך הבא, ${user?.displayName?.split(' ')[0] || 'צופה'}`);
    };

    const handleRegisterSuccess = () => {
        setCurrentView('onboarding');
        setCurrentProfile('1');
    };

    const handleOnboardingComplete = (prefs: string[]) => {
        setUserPreferences(prefs);
        setCurrentView('home');
        showToast('העדפות נשמרו! הפיד שלך מוכן.');
    };

    const handleContentSelect = (movie: Movie) => {
        setSelectedContent(movie);
        // Add to recently viewed (avoid duplicates, keep last 10)
        setRecentlyViewedIds(prev => {
            const filtered = prev.filter(id => id !== movie.id);
            return [movie.id, ...filtered].slice(0, 10);
        });
    };

    // Helper to parse duration string (e.g. "48 דק'") to seconds
    const parseDuration = (durStr?: string): number => {
        if (!durStr) return 0;
        const minutes = parseInt(durStr.replace(/\D/g, ''));
        return isNaN(minutes) ? 0 : minutes * 60;
    };

    // Logic to find the next episode or recommended content
    const calculateNextContent = (currentMovie: Movie, currentUrl: string): NextContent | null => {
        const allContent = getAllContent();

        // Scenario 1: It's a Series
        if (currentMovie.type === 'series' && currentMovie.seasons) {
            let currentSeasonIndex = -1;
            let currentEpisodeIndex = -1;

            // Find current position
            currentMovie.seasons.forEach((season, sIdx) => {
                season.episodes.forEach((ep, eIdx) => {
                    if (ep.videoUrl === currentUrl) {
                        currentSeasonIndex = sIdx;
                        currentEpisodeIndex = eIdx;
                    }
                });
            });

            if (currentSeasonIndex !== -1 && currentEpisodeIndex !== -1) {
                const currentSeason = currentMovie.seasons[currentSeasonIndex];

                // A. Next Episode in same season
                if (currentEpisodeIndex < currentSeason.episodes.length - 1) {
                    const nextEp = currentSeason.episodes[currentEpisodeIndex + 1];
                    return {
                        type: 'episode',
                        title: `פרק ${nextEp.number}: ${nextEp.title}`,
                        thumbnailUrl: nextEp.thumbnailUrl || currentMovie.backdropUrl || currentMovie.thumbnailUrl,
                        videoUrl: nextEp.videoUrl,
                        subTitle: `${currentMovie.title} - ${currentSeason.title}`,
                        duration: parseDuration(nextEp.duration)
                    };
                }

                // B. First Episode of next season
                if (currentSeasonIndex < currentMovie.seasons.length - 1) {
                    const nextSeason = currentMovie.seasons[currentSeasonIndex + 1];
                    if (nextSeason.episodes.length > 0) {
                        const nextEp = nextSeason.episodes[0];
                        return {
                            type: 'episode',
                            title: `פרק ${nextEp.number}: ${nextEp.title}`,
                            thumbnailUrl: nextEp.thumbnailUrl || currentMovie.backdropUrl || currentMovie.thumbnailUrl,
                            videoUrl: nextEp.videoUrl,
                            subTitle: `${currentMovie.title} - ${nextSeason.title}`,
                            duration: parseDuration(nextEp.duration)
                        };
                    }
                }
            }
        }

        // Scenario 2: End of Series OR It's a Movie -> Recommend content
        // Find something with same genre that isn't the current one
        const recommendation = allContent.find(m =>
            m.id !== currentMovie.id &&
            m.genre?.some(g => currentMovie.genre?.includes(g))
        ) || allContent[0];

        const recVideoUrl = recommendation.videoUrl || (recommendation.seasons?.[0]?.episodes?.[0]?.videoUrl);

        if (recVideoUrl) {
            return {
                type: 'movie',
                title: recommendation.title,
                thumbnailUrl: recommendation.backdropUrl || recommendation.thumbnailUrl,
                videoUrl: recVideoUrl,
                subTitle: 'המלצה בשבילך',
                duration: 7200 // Default 2 hours for movies if unknown
            };
        }

        return null;
    };

    const handlePlayVideo = (url: string, title: string = '') => {
        // Determine context (Duration, Intro, Next Item) based on URL
        let introStart: number | undefined;
        let introEnd: number | undefined;
        let duration = 0;
        let foundMovie: Movie | null = selectedContent;
        let videoId: string | null = selectedContent?.id || null;

        // Search in all content if not currently selected (e.g. from Surprise Me)
        if (!foundMovie) {
            const all = getAllContent();
            // Try to find movie by URL or series by episode URL
            for (const m of all) {
                if (m.videoUrl === url) {
                    foundMovie = m;
                    videoId = m.id;
                    break;
                }
                if (m.seasons) {
                    if (m.seasons.some(s => s.episodes.some(e => e.videoUrl === url))) {
                        foundMovie = m;
                        videoId = m.id; // Map episode watch to Series ID for algo
                        break;
                    }
                }
            }
        }

        if (foundMovie) {
            // Prepare Next Content
            const next = calculateNextContent(foundMovie, url);
            setNextUpContent(next);

            if (foundMovie.type === 'movie') {
                introStart = foundMovie.introStart;
                introEnd = foundMovie.introEnd;
                duration = 5400; // 1.5 hours default
            } else if (foundMovie.type === 'series' && foundMovie.seasons) {
                for (const season of foundMovie.seasons) {
                    const ep = season.episodes.find(e => e.videoUrl === url);
                    if (ep) {
                        introStart = ep.introStart;
                        introEnd = ep.introEnd;
                        duration = parseDuration(ep.duration);

                        // Override title for Episode
                        title = `${foundMovie.title}: ${ep.title}`;
                        break;
                    }
                }
            }
        }

        setActiveVideoTitle(title);
        setActiveVideoUrl(url);
        setActiveVideoId(videoId);
        setActiveVideoIntroStart(introStart);
        setActiveVideoIntroEnd(introEnd);
        setActiveVideoDuration(duration > 0 ? duration : 3600); // Default to 1 hour if 0
        setSelectedContent(null);
    };

    const handleContentPlay = (movie: Movie) => {
        if (movie.type === 'series' && movie.seasons && movie.seasons.length > 0) {
            // Default to first episode of first season
            const firstEp = movie.seasons[0].episodes[0];
            handlePlayVideo(firstEp.videoUrl, `${movie.title}: ${firstEp.title}`);
        } else if (movie.videoUrl) {
            handlePlayVideo(movie.videoUrl, movie.title);
        } else {
            // Fallback: If no video is directly playable, open details
            handleContentSelect(movie);
        }
    };

    const handleVideoComplete = () => {
        // Logic triggers when user watches > 90% of content
        if (activeVideoId) {
            setWatchedHistory(prev => {
                const newHistory = [activeVideoId, ...prev.filter(id => id !== activeVideoId)];
                localStorage.setItem('eyalatiatv_history', JSON.stringify(newHistory));
                // Note: The UI updates automatically because 'watchedHistory' state changes trigger re-render
                // and getPersonalizedCategories recalculates scores.
                return newHistory;
            });
            // Don't show toast for every episode, maybe trigger subtle UI update
            console.log("Algorithm Updated: Watched " + activeVideoId);
        }
    };

    const handleClosePlayer = () => {
        setActiveVideoUrl(null);
        setActiveVideoTitle('');
        setActiveVideoId(null);
        setActiveVideoIntroStart(undefined);
        setActiveVideoIntroEnd(undefined);
        setNextUpContent(null);
        setIsPiP(false);
    };

    const togglePiPMode = () => {
        setIsPiP(prev => !prev);
    };

    const handleCloseDetails = () => {
        setSelectedContent(null);
    };

    const handleNavigate = (page: string) => {
        setCurrentView(page as PageView);
    };

    const handleSurpriseMe = () => {
        const all = getAllContent();
        const unseen = all.filter(m => !recentlyViewedIds.includes(m.id));
        const pool = unseen.length > 0 ? unseen : all;
        const random = pool[Math.floor(Math.random() * pool.length)];

        handlePlayVideo(random.videoUrl || (random.seasons?.[0]?.episodes?.[0]?.videoUrl || ''), random.title);
        showToast(`מנגן כעת: ${random.title}`);
    };

    const toggleMyList = (movieId: string) => {
        setMyList(prev => {
            const exists = prev.includes(movieId);
            showToast(exists ? 'הוסר מהרשימה שלי' : 'נוסף לרשימה שלי');
            return exists ? prev.filter(id => id !== movieId) : [...prev, movieId];
        });
    };

    const toggleLike = (movieId: string) => {
        setLikedContent(prev => {
            const exists = prev.includes(movieId);
            showToast(exists ? 'הוסר מהמועדפים' : 'נוסף למועדפים');
            return exists ? prev.filter(id => id !== movieId) : [...prev, movieId];
        });
    };

    // Handle Mood Change
    const handleMoodChange = (mood: string | null) => {
        setCurrentMood(mood);
        if (mood) showToast(`מצב רוח: ${mood === 'pumped' ? 'אקשן' : mood === 'chill' ? 'רגוע' : mood === 'smart' ? 'חוכמה' : 'פחד'}`);
    };

    const renderContent = () => {
        if (currentView === 'login') return <LoginPage onRegisterSuccess={handleRegisterSuccess} />;
        if (currentView === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;
        if (user && !currentProfile) return <ProfileGate onSelectProfile={handleProfileSelect} />;

        const commonProps = {
            onSelect: handleContentSelect,
            onPlay: handleContentPlay,
            myListIds: myList,
            likedIds: likedContent,
            onToggleList: toggleMyList,
            onToggleLike: toggleLike
        };

        if (appLoading || authLoading) return <SkeletonHomePage />;

        switch (currentView) {
            case 'series':
                return <BrowsePage contentType="series" title="סדרות טלוויזיה" showPageTitle={false} {...commonProps} />;
            case 'movies':
                return <BrowsePage contentType="movie" title="סרטים" showPageTitle={false} {...commonProps} />;
            case 'settings':
                return <SettingsPage spoilerProtection={spoilerProtection} setSpoilerProtection={setSpoilerProtection} />;
            case 'search':
                return <AISearch {...commonProps} />;
            case 'new':
                return <BrowsePage title="חדש ופופולרי" showPageTitle={false} {...commonProps} />;
            case 'list':
                const savedMovies = getAllContent().filter(m => myList.includes(m.id));
                if (savedMovies.length > 0) {
                    const heroMovie = savedMovies[savedMovies.length - 1];
                    return (
                        <div className="relative min-h-screen">
                            <Hero
                                movie={heroMovie}
                                onMoreInfo={handleContentSelect}
                                onPlay={handleContentPlay}
                                isAdded={true}
                                onToggleList={() => toggleMyList(heroMovie.id)}
                            />
                            {/* Added pointer-events-none to container and pointer-events-auto to inner content to fix z-index blocking issues */}
                            <div className="relative z-10 space-y-8 md:space-y-12 pb-12 bg-gradient-to-b from-transparent via-[#0d1117] to-[#0d1117] -mt-10 md:-mt-20 px-4 md:px-12 pt-24 md:pt-32 pointer-events-none">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-8 pointer-events-auto">
                                    {savedMovies.slice().reverse().map(movie => (
                                        <div key={movie.id} className="flex justify-center">
                                            <MovieCard
                                                movie={movie}
                                                {...commonProps}
                                                isAdded={true}
                                                isLiked={likedContent.includes(movie.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="min-h-screen px-4 md:px-12 pb-12 pt-24 animate-fade-in flex flex-col items-center justify-center opacity-60">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4">הרשימה שלי</h1>
                        <p className="text-2xl font-bold mb-2">הרשימה שלך ריקה</p>
                        <p>הוסף סרטים וסדרות כדי לצפות בהם מאוחר יותר.</p>
                    </div>
                );

            case 'home':
            default:
                // 1. Get Categories
                const displayCategories = getPersonalizedCategories(userPreferences, watchedHistory, currentMood as string);
                const displayHero = getPersonalizedHero(userPreferences, watchedHistory, currentMood as string);

                // 2. Prepare "Continue Watching" Row
                const continueWatchingMovies = recentlyViewedIds
                    .map(id => getAllContent().find(m => m.id === id))
                    .filter((m): m is Movie => !!m)
                    .map(m => ({ ...m, progress: Math.floor(Math.random() * 80) + 10 })); // Fake progress for demo

                // 3. Prepare "My List" Row
                const myListMovies = myList
                    .map(id => getAllContent().find(m => m.id === id))
                    .filter((m): m is Movie => !!m);

                return (
                    <main className="relative z-0">
                        <Hero
                            movie={displayHero}
                            onMoreInfo={handleContentSelect}
                            onPlay={handleContentPlay}
                            isAdded={myList.includes(displayHero.id)}
                            onToggleList={() => toggleMyList(displayHero.id)}
                        />

                        {/* MOOD & FILTER SELECTOR (Centered and positioned precisely below Hero actions) */}
                        <div className="relative z-30 -mt-8 md:-mt-12 px-4 md:px-12 mb-8 md:mb-12 pointer-events-auto flex justify-center w-full">
                            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-3 px-4 max-w-full justify-center">

                                {/* My List Shortcut */}
                                <button
                                    onClick={() => setCurrentView('list')}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm transition-all whitespace-nowrap hover:scale-105 active:scale-95 shadow-lg focus:ring-2 focus:ring-cyan-500"
                                >
                                    <List className="w-4 h-4" />
                                    הרשימה שלי
                                </button>

                                <div className="w-px h-6 bg-white/20 mx-2"></div>

                                {/* Mood Buttons */}
                                {moods.map((mood) => {
                                    const Icon = mood.icon;
                                    const isActive = currentMood === mood.id;
                                    return (
                                        <button
                                            key={mood.id}
                                            onClick={() => handleMoodChange(isActive ? null : mood.id)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap hover:scale-105 active:scale-95 backdrop-blur-md shadow-lg focus:ring-2 focus:ring-cyan-500 ${isActive
                                                    ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                                                    : 'bg-white/10 text-white border-white/10 hover:bg-white/20 hover:border-white/30'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {mood.label}
                                        </button>
                                    );
                                })}

                                {/* Clear Filter Button (Visible only when mood is selected) */}
                                {currentMood && (
                                    <button
                                        onClick={() => handleMoodChange(null)}
                                        className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-200 border border-red-500/30 transition-all ml-2 animate-fade-in"
                                        title="נקה סינון"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Pushed content down with mt-0 instead of negative margin to avoid overlap with centered hero */}
                        <div className="relative z-10 space-y-8 md:space-y-12 pb-24 md:pb-12 bg-gradient-to-b from-[#0d1117] to-[#0d1117]">

                            {/* ROW 1: Continue Watching */}
                            {continueWatchingMovies.length > 0 && !currentMood && (
                                <MovieRow
                                    title="המשך צפייה"
                                    movies={continueWatchingMovies}
                                    {...commonProps}
                                />
                            )}

                            {/* ROW 2: My List */}
                            {myListMovies.length > 0 && !currentMood && (
                                <MovieRow
                                    title="הרשימה שלי"
                                    movies={myListMovies}
                                    {...commonProps}
                                />
                            )}

                            {/* ROW 3+: Dynamic Categories */}
                            {displayCategories.map((category) => (
                                <MovieRow
                                    key={category.id}
                                    title={category.title}
                                    movies={category.movies}
                                    isRanked={category.isRanked}
                                    {...commonProps}
                                />
                            ))}
                        </div>
                    </main>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">

            {/* Top Navbar */}
            <Navbar
                activePage={currentView}
                onNavigate={handleNavigate}
                onSurpriseMe={handleSurpriseMe}
                currentMood={currentMood}
                onMoodChange={handleMoodChange}
            />

            {/* Main Content Area */}
            <div className={`${activeVideoUrl && !isPiP ? 'hidden' : 'block'}`}>
                {renderContent()}
            </div>

            {/* Mobile Bottom Navigation (Visible only on mobile/logged in) */}
            {user && currentView !== 'login' && currentView !== 'onboarding' && !activeVideoUrl && (
                <BottomNav activePage={currentView} onNavigate={handleNavigate} />
            )}

            {/* Video Player */}
            {activeVideoUrl && (
                <VideoPlayer
                    videoUrl={activeVideoUrl}
                    title={activeVideoTitle || selectedContent?.title || ''}
                    onClose={handleClosePlayer}
                    isExternal={selectedContent?.isExternalLink}
                    type={selectedContent?.type || 'movie'}
                    isPiP={isPiP}
                    onTogglePiP={togglePiPMode}
                    introStart={activeVideoIntroStart}
                    introEnd={activeVideoIntroEnd}
                    duration={activeVideoDuration}
                    nextItem={nextUpContent}
                    onPlayNext={(url, title) => handlePlayVideo(url, title)}
                    onComplete={handleVideoComplete}
                />
            )}

            {/* Details Modal */}
            {selectedContent && !activeVideoUrl && (
                <ContentDetails
                    movie={selectedContent}
                    onClose={handleCloseDetails}
                    onSelect={handleContentSelect}
                    isAdded={myList.includes(selectedContent.id)}
                    isLiked={likedContent.includes(selectedContent.id)}
                    onToggleList={() => toggleMyList(selectedContent.id)}
                    onToggleLike={() => toggleLike(selectedContent.id)}
                    spoilerProtection={spoilerProtection}
                    onPlay={(url) => handlePlayVideo(url, selectedContent.title)}
                />
            )}

            {/* Toast Notification */}
            <div className={`fixed bottom-24 md:bottom-8 right-8 z-[200] transition-all duration-300 transform ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-white text-black px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold border-l-4 border-cyan-500">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span>{toastMessage}</span>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
