
import React, { useState } from 'react';
import {
    Check, Sparkles, ArrowRight, Film, User,
    Rocket, Zap, Clapperboard, Laugh, Eye, Ghost,
    Gamepad2, Crown, ChevronRight
} from 'lucide-react';
import { ANIME_AVATARS } from './AvatarGallery';

interface OnboardingProps {
    onComplete: (data: { name: string; avatar: string; preferences: string[] }) => void;
}

const GENRES = [
    { id: 'מדע בדיוני', label: 'מדע בדיוני', icon: Rocket, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/50' },
    { id: 'אקשן', label: 'אקשן ופעולה', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/50' },
    { id: 'דרמה', label: 'דרמה', icon: Clapperboard, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/50' },
    { id: 'קומדיה', label: 'קומדיה', icon: Laugh, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/50' },
    { id: 'מתח', label: 'מתח ומסתורין', icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/50' },
    { id: 'אימה', label: 'אימה', icon: Ghost, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/50' },
    { id: 'אנימה', label: 'אנימה', icon: Gamepad2, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/50' },
    { id: 'פנטזיה', label: 'פנטזיה', icon: Crown, color: 'text-amber-200', bg: 'bg-amber-500/10', border: 'border-amber-500/50' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [profileName, setProfileName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(ANIME_AVATARS[0].url);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleFinish = () => {
        onComplete({
            name: profileName.trim() || 'User',
            avatar: selectedAvatar,
            preferences: selectedGenres
        });
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#0d1117] flex flex-col items-center justify-center animate-fade-in px-4 overflow-y-auto">
            <div className="max-w-4xl w-full text-center my-8">

                {/* Progress Bar */}
                <div className="flex justify-center mb-12 gap-3">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-16 rounded-full transition-all duration-500 ${step >= s
                                    ? 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                                    : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                {/* STEP 1: Genre Selection */}
                {step === 1 && (
                    <div className="animate-slide-up max-w-3xl mx-auto">
                        <div className="mb-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/20 rotate-3 border border-white/10">
                                <Sparkles className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">ברוכים הבאים <span className="text-cyan-400">לאייל עטייה TV</span></h1>
                            <p className="text-2xl text-gray-400 font-medium max-w-xl mx-auto leading-relaxed">בוא נתאים את החוויה במיוחד בשבילך. מה מעניין אותך?</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
                            {GENRES.map((genre) => {
                                const isSelected = selectedGenres.includes(genre.id);
                                return (
                                    <button
                                        key={genre.id}
                                        onClick={() => toggleGenre(genre.id)}
                                        className={`relative h-40 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group overflow-hidden ${isSelected
                                                ? `border-transparent ${genre.bg} ring-2 ring-offset-2 ring-offset-[#0d1117] ${genre.color.replace('text', 'ring')} scale-105 shadow-xl`
                                                : 'border-white/5 bg-[#161b22] hover:border-white/20 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-2xl transition-all duration-300 ${isSelected ? 'bg-white/10' : 'bg-black/20 group-hover:bg-black/40'}`}>
                                            <genre.icon className={`w-10 h-10 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'} ${genre.color}`} />
                                        </div>
                                        <span className={`font-bold text-lg tracking-wide ${isSelected ? 'text-white' : 'text-gray-400'}`}>{genre.label}</span>

                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Check className={`w-4 h-4 text-black stroke-[3]`} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={selectedGenres.length === 0}
                            className="bg-white text-black font-black text-xl px-16 py-5 rounded-2xl hover:bg-cyan-400 hover:text-white hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-800 disabled:text-gray-500 shadow-2xl flex items-center gap-3 mx-auto"
                        >
                            <span>המשך לשלב הבא</span>
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* STEP 2: Avatar & Name Selection */}
                {step === 2 && (
                    <div className="animate-slide-up max-w-5xl mx-auto">
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">זהות ושם פרופיל</h1>
                            <p className="text-xl text-gray-400">איך תרצה להופיע במערכת?</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-12 items-start justify-center">

                            {/* Left: Avatar Grid */}
                            <div className="flex-1 w-full bg-[#161b22] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                                <label className="text-sm font-bold text-gray-400 block mb-6 text-right uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    בחר דמות
                                </label>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {ANIME_AVATARS.map((avatar) => (
                                        <button
                                            key={avatar.id}
                                            onClick={() => setSelectedAvatar(avatar.url)}
                                            className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 group ${selectedAvatar === avatar.url
                                                    ? 'ring-4 ring-cyan-500 scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] z-10'
                                                    : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-105 opacity-70 hover:opacity-100 grayscale hover:grayscale-0'
                                                }`}
                                        >
                                            <img
                                                src={avatar.url}
                                                alt={avatar.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Preview & Input */}
                            <div className="w-full md:w-96 flex flex-col gap-8">
                                <div className="bg-gradient-to-b from-[#1c232e] to-[#0d1117] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-50" />

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-40 h-40 rounded-[2rem] ring-4 ring-white/10 shadow-2xl mb-6 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={selectedAvatar}
                                                alt="Selected avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            value={profileName}
                                            onChange={(e) => setProfileName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 focus:border-cyan-500 rounded-xl py-4 px-6 text-white placeholder-gray-600 focus:outline-none transition-all text-center text-xl font-black mb-2 focus:bg-black/60"
                                            placeholder="הכנס שם..."
                                            maxLength={25}
                                            autoFocus
                                        />
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{profileName.length}/25 תווים</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(3)}
                                    disabled={profileName.trim().length < 2}
                                    className="w-full bg-white text-black font-black text-xl py-6 rounded-2xl hover:bg-cyan-400 hover:text-white hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-800 disabled:text-gray-500 shadow-2xl"
                                >
                                    המשך לסיום
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Final Confirmation */}
                {step === 3 && (
                    <div className="animate-slide-up max-w-2xl mx-auto">
                        <div className="mb-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20 rotate-3">
                                <Film className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">הכל מוכן!</h1>
                            <p className="text-xl text-gray-400 mb-8">אנחנו בונים את הפיד המושלם בשבילך...</p>

                            <div className="bg-[#161b22] p-8 rounded-[2.5rem] border border-white/10 mx-auto mb-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-5 h-5" /></div>
                                        <div className="text-right">
                                            <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider">נושאים נבחרים</span>
                                            <span className="text-white font-bold text-lg">{selectedGenres.slice(0, 3).map(g => GENRES.find(gen => gen.id === g)?.label).join(', ')}{selectedGenres.length > 3 ? '...' : ''}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-5 h-5" /></div>
                                        <div className="text-right">
                                            <span className="block text-gray-400 text-xs font-bold uppercase tracking-wider">פרופיל אישי</span>
                                            <span className="text-white font-bold text-lg">{profileName}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400"><Sparkles className="w-5 h-5" /></div>
                                        <span className="text-cyan-100 font-bold text-lg">מכין את הסרטים והסדרות שלך...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFinish}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl px-16 py-6 rounded-2xl hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-105 transition-all flex items-center gap-3 mx-auto shadow-2xl"
                        >
                            <span>כנס לעולם של אייל עטייה TV</span>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
