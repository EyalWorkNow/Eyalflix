
import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Film } from 'lucide-react';

interface OnboardingProps {
    onComplete: (preferences: string[]) => void;
}

const GENRES = [
    { id: 'מדע בדיוני', label: 'מדע בדיוני', emoji: '👽' },
    { id: 'אקשן', label: 'אקשן ופעולה', emoji: '💥' },
    { id: 'דרמה', label: 'דרמה', emoji: '🎭' },
    { id: 'קומדיה', label: 'קומדיה', emoji: '😂' },
    { id: 'מתח', label: 'מתח ומסתורין', emoji: '🔍' },
    { id: 'אימה', label: 'אימה', emoji: '👻' },
    { id: 'אנימה', label: 'אנימה', emoji: '⛩️' },
    { id: 'פנטזיה', label: 'פנטזיה', emoji: '🐉' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [step, setStep] = useState(1);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleFinish = () => {
        // Save to local storage for persistence across reloads in this demo
        localStorage.setItem('eyalatiatv_preferences', JSON.stringify(selectedGenres));
        onComplete(selectedGenres);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#0d1117] flex flex-col items-center justify-center animate-fade-in px-4">
            <div className="max-w-2xl w-full text-center">
                
                {/* Progress Bar */}
                <div className="flex justify-center mb-12 gap-2">
                    <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-gray-800'}`} />
                    <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-gray-800'}`} />
                </div>

                {step === 1 ? (
                    <div className="animate-slide-up">
                        <div className="mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/20 rotate-3">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">ברוכים הבאים ל-EyalAtiaTV</h1>
                            <p className="text-xl text-gray-400">בואו נתאים את החוויה במיוחד בשבילכם. מה אתם אוהבים לראות?</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {GENRES.map((genre) => {
                                const isSelected = selectedGenres.includes(genre.id);
                                return (
                                    <button
                                        key={genre.id}
                                        onClick={() => toggleGenre(genre.id)}
                                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                                            isSelected 
                                            ? 'border-cyan-500 bg-cyan-500/10 scale-105 shadow-lg shadow-cyan-500/20' 
                                            : 'border-white/10 bg-[#161b22] hover:border-white/30 hover:bg-white/5'
                                        }`}
                                    >
                                        <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform">{genre.emoji}</span>
                                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{genre.label}</span>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-black stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={selectedGenres.length === 0}
                            className="bg-white text-black font-black text-lg px-12 py-4 rounded-xl hover:bg-cyan-500 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-600 disabled:text-gray-400 shadow-xl"
                        >
                            המשך לשלב הבא
                        </button>
                    </div>
                ) : (
                    <div className="animate-slide-up">
                        <div className="mb-8">
                             <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/20 -rotate-3">
                                <Film className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-black text-white mb-4">אנחנו בונים את הפיד שלך...</h1>
                            <p className="text-gray-400 text-lg mb-8">בהתבסס על הבחירות שלך: <span className="text-cyan-400 font-bold">{selectedGenres.join(', ')}</span></p>
                            
                            <div className="bg-[#161b22] p-6 rounded-2xl border border-white/10 max-w-lg mx-auto mb-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-4 h-4" /></div>
                                        <span className="text-gray-300">התאמת דף הבית</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-4 h-4" /></div>
                                        <span className="text-gray-300">סינון המלצות</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 animate-pulse"><Sparkles className="w-4 h-4" /></div>
                                        <span className="text-white font-bold">מכין את הפרופיל שלך...</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                         <button
                            onClick={handleFinish}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-lg px-12 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                        >
                            <span>סיים והכנס לאתר</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
