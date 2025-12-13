
import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  onMoreInfo: (movie: Movie) => void;
  onPlay?: (movie: Movie) => void;
  isAdded?: boolean;
  onToggleList?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ movie, onMoreInfo, onPlay, isAdded, onToggleList }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const videoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Helper to extract a usable embed URL for background playback
  const getBackgroundVideoUrl = (url?: string) => {
      if (!url) return '';
      if (url.includes('drive.google.com')) return '';
      
      let videoId = '';
      if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
      else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
      
      if (!videoId) return '';
      
      // Playlist param added to enable looping of single video
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&disablekb=1&fs=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&iv_load_policy=3&rel=0`;
  };

  useEffect(() => {
    setShowVideo(false);
    setIsMuted(true);

    if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);

    const canPlayVideo = movie.videoUrl && !movie.videoUrl.includes('drive.google.com');

    if (canPlayVideo) {
        videoTimeoutRef.current = setTimeout(() => {
            setShowVideo(true);
        }, 2500); // Wait 2.5s before playing video for smooth transition
    }

    return () => {
        if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
    };
  }, [movie.id]); // Reset on movie change

  // Parallax Logic
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!heroRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15; // Subtle movement
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setParallax({ x, y });
  };

  const bgVideoUrl = getBackgroundVideoUrl(movie.videoUrl);

  return (
    <div 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        // Optimized height: 85vh for mobile, 100vh for TV immersive feel
        className="relative h-[85vh] md:h-screen w-full text-white overflow-hidden group perspective-container bg-[#0d1117]"
    >
      
      {/* --- LAYER 1: MEDIA (Image & Video) --- */}
      <div 
        className="absolute inset-0 z-0 transition-transform duration-700 ease-out will-change-transform"
        style={{
            transform: `scale(1.05) translate(${-parallax.x}px, ${-parallax.y}px)`
        }}
      >
         {/* Fallback/Poster Image */}
         <img
          src={movie.backdropUrl || movie.thumbnailUrl}
          alt={movie.title}
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'} ${imageLoaded ? 'scale-100' : 'scale-110 blur-sm'}`}
        />

        {/* Video Player Iframe */}
        {showVideo && bgVideoUrl && (
            <div className="absolute inset-0 w-full h-[140%] -top-[20%] pointer-events-none opacity-0 animate-fade-in" style={{ animationDuration: '1.5s' }}>
                <iframe 
                    src={bgVideoUrl}
                    className="w-full h-full object-cover scale-110"
                    allow="autoplay; encrypted-media"
                    title="Hero Background"
                />
            </div>
        )}
      </div>

      {/* --- LAYER 2: CINEMATIC GRADIENTS --- */}
      {/* Top Gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d1117]/90 to-transparent z-10" />
      
      {/* Bottom Gradient - Reduced height to allow centering */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent z-10" />
      
      {/* Radial Gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0d1117]/30 to-[#0d1117]/70 z-10" />


      {/* --- LAYER 3: CONTENT --- */}
      {/* Centered Layout: Removed large bottom padding to center content for TV UI */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-4 md:px-16 text-center pb-12">
        <div className="w-full max-w-5xl flex flex-col items-center gap-4 md:gap-8">
            
            {/* Title */}
            <h1 
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-slide-up opacity-0 origin-bottom" 
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards', WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
            >
              {movie.title}
            </h1>
            
            {/* Metadata Badges */}
            <div 
                className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-base font-medium text-white/90 animate-slide-up opacity-0"
                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
            >
                {movie.matchScore && (
                    <span className="text-[#22d3ee] font-extrabold drop-shadow-md">{movie.matchScore}% התאמה</span>
                )}
                <span className="text-gray-300">{movie.year}</span>
                
                {movie.rating && (
                    <span className="border border-white/40 px-2 py-0.5 rounded text-xs bg-black/20 backdrop-blur-sm">{movie.rating}</span>
                )}
                
                <span className="flex items-center gap-1 border border-white/40 px-2 py-0.5 rounded text-xs bg-black/20 backdrop-blur-sm" title="High Definition">
                    <Maximize2 className="w-3 h-3" /> 4K
                </span>
                
                <span className="hidden md:block w-1 h-1 rounded-full bg-gray-500"></span>
                
                {movie.genre && (
                    <span className="hidden md:inline-block text-gray-200">
                        {movie.genre.slice(0, 3).join(' • ')}
                    </span>
                )}
            </div>

            {/* Description */}
            <p 
                className="text-base md:text-2xl text-gray-100 line-clamp-3 leading-relaxed drop-shadow-md font-light max-w-4xl mx-auto animate-slide-up opacity-0 px-2 md:px-0" 
                style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
            >
              {movie.description}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 animate-slide-up opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
                 <button 
                    onClick={() => onPlay ? onPlay(movie) : onMoreInfo(movie)}
                    className="group relative flex items-center justify-center gap-3 px-8 md:px-12 py-3 md:py-5 rounded-xl font-bold text-lg md:text-2xl bg-white text-black transition-all hover:bg-[#22d3ee] hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] z-20 focus:ring-4 focus:ring-white/50"
                >
                    <Play className="w-6 h-6 md:w-8 md:h-8 fill-black group-hover:fill-black transition-colors" />
                    <span>נגן</span>
                </button>

                <button 
                    onClick={() => onMoreInfo(movie)}
                    className="flex items-center justify-center gap-3 px-8 md:px-12 py-3 md:py-5 rounded-xl font-bold text-lg md:text-2xl bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-lg z-20 focus:ring-4 focus:ring-white/50"
                >
                    <Info className="w-6 h-6 md:w-8 md:h-8" />
                    <span>מידע נוסף</span>
                </button>
                
                {onToggleList && (
                    <button 
                        onClick={onToggleList}
                        className="hidden md:flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white transition-all hover:scale-105 active:scale-95 shadow-lg z-20 tooltip-container focus:ring-4 focus:ring-white/50"
                        title={isAdded ? 'הסר מהרשימה' : 'הוסף לרשימה'}
                    >
                        {isAdded ? <Check className="w-7 h-7 md:w-9 md:h-9 text-[#22d3ee]" /> : <Plus className="w-7 h-7 md:w-9 md:h-9" />}
                    </button>
                )}
            </div>
        </div>

        {/* Audio Toggle */}
        {showVideo && (
            <div className="absolute right-6 md:right-16 bottom-[5%] z-30 animate-fade-in">
                 <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-12 h-12 rounded-full border border-white/20 bg-black/30 hover:bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition hover:scale-110"
                 >
                     {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};
