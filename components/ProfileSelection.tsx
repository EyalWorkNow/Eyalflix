
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { Plus, Edit2, Check, X, ArrowRight, User, Sparkles, Trash2, Camera } from 'lucide-react';
import { AvatarGallery } from './AvatarGallery';

export const ProfileSelection: React.FC = () => {
    const { profiles, selectProfile, addProfile, deleteProfile, updateProfile } = useAuth();
    const [isManaging, setIsManaging] = useState(false);
    const [designerMode, setDesignerMode] = useState<'create' | 'edit' | null>(null);
    const [showAvatarGallery, setShowAvatarGallery] = useState(false);

    // Designer State
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');
    const [tempAvatar, setTempAvatar] = useState('');

    const openDesigner = (mode: 'create' | 'edit', profile?: UserProfile) => {
        setDesignerMode(mode);
        if (profile) {
            setSelectedProfileId(profile.id);
            setTempName(profile.name);
            setTempAvatar(profile.avatar);
        } else {
            setSelectedProfileId(null);
            setTempName('');
            setTempAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=Main');
        }
    };

    const handleSave = () => {
        if (!tempName.trim()) return;

        if (designerMode === 'create') {
            addProfile(tempName, tempAvatar);
        } else if (designerMode === 'edit' && selectedProfileId) {
            updateProfile(selectedProfileId, { name: tempName, avatar: tempAvatar });
        }

        setDesignerMode(null);
        setIsManaging(false);
    };

    if (designerMode) {
        return (
            <div className="fixed inset-0 z-[150] bg-[#0a0a0b] flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-cyan-500/20 blur-[150px] rounded-full animate-pulse" />
                </div>

                <div className="w-full max-w-2xl bg-[#161b22] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-scale-up">
                    <button
                        onClick={() => setDesignerMode(null)}
                        className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <h2 className="text-4xl font-black text-white mb-12 text-center flex items-center justify-center gap-3">
                        <Sparkles className="text-cyan-400" />
                        {designerMode === 'create' ? 'צור זהות חדשה' : 'ערוך פרופיל'}
                    </h2>

                    <div className="flex flex-col items-center gap-10">
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-4 ring-white/10 group-hover:ring-cyan-500/50 transition-all duration-300 shadow-2xl">
                                <img src={tempAvatar} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => setShowAvatarGallery(true)}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm"
                                >
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="font-bold">החלט דמות</span>
                                </button>
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <label className="text-gray-500 font-bold text-sm uppercase tracking-widest px-1">איך קוראים לך?</label>
                            <input
                                autoFocus
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-bold text-white outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-center"
                                placeholder="שם הפרופיל..."
                            />
                        </div>

                        <div className="flex gap-4 w-full pt-4">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-white hover:bg-cyan-400 text-black font-black py-4 rounded-2xl text-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-cyan-500/10 focus:ring-4 focus:ring-cyan-500"
                            >
                                {designerMode === 'create' ? 'בוא נראה אנימה' : 'שמור שינויים'}
                            </button>
                        </div>
                    </div>
                </div>

                {showAvatarGallery && (
                    <AvatarGallery
                        onClose={() => setShowAvatarGallery(false)}
                        onSelect={(url) => setTempAvatar(url)}
                        currentAvatar={tempAvatar}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0b] flex flex-col items-center justify-center animate-fade-in overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-20 tracking-tight drop-shadow-2xl relative z-10 transition-all">
                {isManaging ? 'ניהול פרופילים' : 'מי צופה עכשיו?'}
            </h1>

            <div className="flex flex-wrap justify-center gap-8 md:gap-14 max-w-6xl px-8 relative z-10">
                {profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="group flex flex-col items-center gap-6"
                    >
                        <div className="relative">
                            <button
                                onClick={() => isManaging ? openDesigner('edit', profile) : selectProfile(profile)}
                                className={`
                                    relative w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden
                                    transition-all duration-500 transform
                                    ${isManaging
                                        ? 'ring-4 ring-white/10 hover:ring-cyan-500 hover:scale-105'
                                        : 'ring-0 hover:ring-8 hover:ring-cyan-500/30 hover:scale-110 active:scale-95'}
                                    shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                                `}
                            >
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className={`w-full h-full object-cover transition-all duration-500 ${isManaging ? 'opacity-40 grayscale-[0.5]' : 'group-hover:scale-110'}`}
                                />

                                {isManaging ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white scale-110">
                                            <Edit2 className="w-7 h-7" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>

                            {isManaging && profiles.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteProfile(profile.id);
                                    }}
                                    className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-12 transition-all active:scale-90 z-20"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <span className={`text-2xl md:text-3xl font-bold tracking-tight transition-all duration-300 ${isManaging ? 'text-gray-500' : 'text-zinc-400 group-hover:text-cyan-400 group-hover:translate-y-1'}`}>
                            {profile.name}
                        </span>
                    </div>
                ))}

                {profiles.length < 4 && (
                    <div className="flex flex-col items-center gap-6 group">
                        <button
                            onClick={() => openDesigner('create')}
                            className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-zinc-900/50 border-4 border-dashed border-zinc-800 flex items-center justify-center transition-all duration-500 hover:bg-zinc-800 hover:border-cyan-500/50 hover:scale-105 group"
                        >
                            <Plus className="w-16 h-16 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                        </button>
                        <span className="text-2xl md:text-3xl font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                            הוסף
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-24 flex items-center gap-6 relative z-10">
                <button
                    onClick={() => setIsManaging(!isManaging)}
                    className={`
                        px-10 py-3 rounded-2xl text-xl font-black tracking-widest uppercase transition-all duration-500
                        ${isManaging
                            ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'}
                    `}
                >
                    {isManaging ? 'סיום' : 'ניהול פרופילים'}
                </button>
            </div>

            {/* Hint for TV Users */}
            <div className="absolute bottom-10 text-gray-600 text-sm font-medium animate-pulse hidden md:block">
                השתמש בחצים וב-Enter לניווט מהיר
            </div>
        </div>
    );
};
