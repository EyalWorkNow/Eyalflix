
import React, { useState } from 'react';
import { User, CreditCard, Monitor, Shield, LogOut, Edit2, LogIn, Smartphone, Tv, Wifi, ChevronRight, Check, Sparkles, Type, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
    spoilerProtection: boolean;
    setSpoilerProtection: (val: boolean) => void;
}

// Reusable Toggle Switch Component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => {
    return (
        <button 
            onClick={onChange}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${checked ? 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-gray-700 border border-gray-600'}`}
        >
            <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
    );
};

// Reusable Selection Chip
const SelectionChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${active ? 'bg-white text-black border-white shadow-lg' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'}`}
    >
        {label}
    </button>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ spoilerProtection, setSpoilerProtection }) => {
    const { user, signInWithGoogle, logout } = useAuth();
    const [autoPlay, setAutoPlay] = useState(true);
    const [dataSaver, setDataSaver] = useState(false);
    const [subtitleSize, setSubtitleSize] = useState<'small' | 'medium' | 'large'>('medium');
    const [subtitleColor, setSubtitleColor] = useState<'white' | 'yellow'>('white');

    // Default mock data with GLOBAL PASS logic
    const displayUser = user ? {
        name: user.displayName || 'משתמש ללא שם',
        email: user.email || '',
        avatar: user.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        plan: 'Global FHD Pass'
    } : {
        name: 'אורח',
        email: 'לא מחובר',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
        plan: 'חינם'
    };

    return (
        <div className="min-h-screen bg-[#0d1117] pt-24 pb-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">הגדרות</h1>
                        <p className="text-gray-400">נהל את החשבון, ההעדפות והמנוי שלך</p>
                    </div>
                    {user && (
                        <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Wifi className="w-3 h-3" /> מחובר
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Profile & Plan (Usually 4/12 width) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Profile Card */}
                        <div className="bg-[#161b22] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
                            
                            <div className="relative flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <img src={displayUser.avatar} alt="Profile" className="w-24 h-24 rounded-2xl ring-4 ring-[#0d1117] shadow-2xl object-cover" />
                                    {user && <button className="absolute -bottom-2 -right-2 bg-gray-800 p-2 rounded-full border border-gray-600 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-colors shadow-lg"><Edit2 className="w-4 h-4" /></button>}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{displayUser.name}</h2>
                                <p className="text-sm text-gray-500 font-mono mb-6">{displayUser.email}</p>
                                
                                {user ? (
                                    <button 
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 py-3 rounded-xl font-bold transition-all duration-300"
                                    >
                                        <LogOut className="w-4 h-4" /> התנתק
                                    </button>
                                ) : (
                                     <button 
                                        onClick={signInWithGoogle}
                                        className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-black hover:bg-cyan-400 py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                                    >
                                        <LogIn className="w-4 h-4" /> התחבר
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Subscription Card */}
                        {user && (
                            <div className="bg-gradient-to-br from-[#1c2128] to-[#0d1117] rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard className="w-32 h-32 text-white" /></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="text-xs font-black uppercase tracking-widest">מנוי גלובלי</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-1">Global Pass</h3>
                                    <p className="text-gray-400 text-sm mb-6">צפייה ללא הגבלה • Full HD</p>
                                    
                                    <div className="w-full bg-gray-700/50 h-1.5 rounded-full mb-4 overflow-hidden">
                                        <div className="bg-cyan-500 h-full w-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                                        <Check className="w-4 h-4" />
                                        <span>פעיל במכשיר זה</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Device Management (Mock) */}
                        {user && (
                             <div className="bg-[#161b22] rounded-3xl p-6 border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-gray-400" /> מכשירים מחוברים</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Tv className="w-5 h-5 text-cyan-400" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-white">טלוויזיה בסלון</p>
                                                <p className="text-xs text-green-400">פעיל כעת</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between group opacity-60 hover:opacity-100 transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center"><Smartphone className="w-5 h-5 text-gray-400" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-white">iPhone 13 Pro</p>
                                                <p className="text-xs text-gray-500">לפני שעתיים</p>
                                            </div>
                                        </div>
                                        <button className="text-xs text-red-400 hover:underline">נתק</button>
                                    </div>
                                </div>
                             </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Settings Content (8/12 width) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* PLAYBACK SETTINGS */}
                        <div className="bg-[#161b22] rounded-3xl border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Monitor className="w-6 h-6 text-blue-400" /></div>
                                <h3 className="text-xl font-bold text-white">תצוגה והפעלה</h3>
                            </div>
                            
                            <div className="p-6 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white text-lg">הפעלה אוטומטית</p>
                                        <p className="text-sm text-gray-400 max-w-sm">התחל לנגן את הפרק הבא בסדרה באופן אוטומטי בסיום הפרק הנוכחי.</p>
                                    </div>
                                    <ToggleSwitch checked={autoPlay} onChange={() => setAutoPlay(!autoPlay)} />
                                </div>
                                
                                <div className="h-px bg-white/5" />

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white text-lg">חיסכון בנתונים</p>
                                        <p className="text-sm text-gray-400 max-w-sm">הפחת את איכות הוידאו בשימוש ברשת סלולרית.</p>
                                    </div>
                                    <ToggleSwitch checked={dataSaver} onChange={() => setDataSaver(!dataSaver)} />
                                </div>
                            </div>
                        </div>

                        {/* SUBTITLES SETTINGS (With Visual Preview) */}
                        <div className="bg-[#161b22] rounded-3xl border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg"><Type className="w-6 h-6 text-yellow-400" /></div>
                                <h3 className="text-xl font-bold text-white">מראה כתוביות</h3>
                            </div>

                            <div className="p-6">
                                {/* LIVE PREVIEW BOX */}
                                <div className="w-full aspect-[21/9] bg-gray-800 rounded-xl mb-8 relative overflow-hidden flex items-end justify-center pb-8 group border border-white/10">
                                    <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" alt="Preview" />
                                    <div className="relative z-10 px-4 py-2 bg-black/60 rounded text-center transition-all duration-300">
                                        <p 
                                            className={`font-medium leading-tight transition-all duration-300 ${subtitleColor === 'yellow' ? 'text-yellow-400' : 'text-white'}`}
                                            style={{ fontSize: subtitleSize === 'small' ? '14px' : subtitleSize === 'medium' ? '18px' : '24px' }}
                                        >
                                            הכתוביות יראו כך בזמן הצפייה
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">גודל טקסט</p>
                                        <div className="flex items-center gap-2 bg-[#0d1117] p-1.5 rounded-xl border border-white/5 w-fit">
                                            <SelectionChip label="קטן" active={subtitleSize === 'small'} onClick={() => setSubtitleSize('small')} />
                                            <SelectionChip label="רגיל" active={subtitleSize === 'medium'} onClick={() => setSubtitleSize('medium')} />
                                            <SelectionChip label="גדול" active={subtitleSize === 'large'} onClick={() => setSubtitleSize('large')} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">צבע טקסט</p>
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => setSubtitleColor('white')}
                                                className={`w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center transition-all ${subtitleColor === 'white' ? 'border-cyan-500 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent opacity-70'}`}
                                            >
                                                {subtitleColor === 'white' && <Check className="w-5 h-5 text-black" />}
                                            </button>
                                            <button 
                                                onClick={() => setSubtitleColor('yellow')}
                                                className={`w-10 h-10 rounded-full bg-yellow-400 border-2 flex items-center justify-center transition-all ${subtitleColor === 'yellow' ? 'border-cyan-500 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent opacity-70'}`}
                                            >
                                                {subtitleColor === 'yellow' && <Check className="w-5 h-5 text-black" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PRIVACY / SPOILERS */}
                        <div className="bg-[#161b22] rounded-3xl border border-white/10 overflow-hidden">
                             <div className="p-6 border-b border-white/5 flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg"><Shield className="w-6 h-6 text-purple-400" /></div>
                                <h3 className="text-xl font-bold text-white">פרטיות ותוכן</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-white text-lg">הגנת ספוילרים</p>
                                            <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">חדש</span>
                                        </div>
                                        <p className="text-sm text-gray-400 max-w-sm">טשטש תמונות ותקצירים של פרקים שעוד לא צפית בהם.</p>
                                    </div>
                                    <ToggleSwitch checked={spoilerProtection} onChange={() => setSpoilerProtection(!spoilerProtection)} />
                                </div>
                            </div>
                        </div>

                         {/* LANGUAGE */}
                         <div className="bg-[#161b22] rounded-3xl border border-white/10 overflow-hidden flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition group">
                             <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-white/10 transition"><Globe className="w-6 h-6 text-gray-300 group-hover:text-white" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">שפת ממשק</h3>
                                    <p className="text-sm text-gray-400">עברית (ישראל)</p>
                                </div>
                             </div>
                             <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition" />
                         </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
