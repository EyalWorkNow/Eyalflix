
import React from 'react';
import { X, Search, Sparkles } from 'lucide-react';

export const ANIME_AVATARS = [
    { id: 'avatar1', name: 'Identity 1', url: '/userimg/Gemini_Generated_Image_6pv23g6pv23g6pv2.png', category: 'Premium' },
    { id: 'avatar2', name: 'Identity 2', url: '/userimg/Gemini_Generated_Image_dxhs28dxhs28dxhs.png', category: 'Premium' },
    { id: 'avatar3', name: 'Identity 3', url: '/userimg/Gemini_Generated_Image_escb7qescb7qescb.png', category: 'Premium' },
    { id: 'avatar4', name: 'Identity 4', url: '/userimg/Gemini_Generated_Image_fhgjghfhgjghfhgj.png', category: 'Premium' },
    { id: 'avatar5', name: 'Identity 5', url: '/userimg/Gemini_Generated_Image_idaru5idaru5idar.png', category: 'Premium' },
    { id: 'avatar6', name: 'Identity 6', url: '/userimg/Gemini_Generated_Image_qfdh3uqfdh3uqfdh.png', category: 'Premium' },
    { id: 'avatar7', name: 'Identity 7', url: '/userimg/Gemini_Generated_Image_v5mat9v5mat9v5ma.png', category: 'Premium' },
    { id: 'avatar8', name: 'Identity 8', url: '/userimg/Gemini_Generated_Image_vkzj4svkzj4svkzj.png', category: 'Premium' },
    { id: 'avatar9', name: 'Identity 9', url: '/userimg/Gemini_Generated_Image_y3fty4y3fty4y3ft.png', category: 'Premium' },
];

interface AvatarGalleryProps {
    onSelect: (url: string) => void;
    onClose: () => void;
    currentAvatar?: string;
}

export const AvatarGallery: React.FC<AvatarGalleryProps> = ({ onSelect, onClose, currentAvatar }) => {
    const categories = ['All', 'Premium'];
    const [activeCategory, setActiveCategory] = React.useState('All');

    const filteredAvatars = ANIME_AVATARS.filter(a =>
        activeCategory === 'All' || a.category === activeCategory
    );

    return (
        <div className="fixed inset-0 z-[200] bg-[#0d1117]/95 backdrop-blur-xl flex flex-col items-center p-6 md:p-12 animate-fade-in">
            <div className="w-full max-w-5xl flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
                        <Sparkles className="text-cyan-400" />
                        בחר את הזהות שלך
                    </h2>
                    <p className="text-gray-400">בחר דמות שמתאימה לסגנון הצפייה שלך</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-8 h-8" />
                </button>
            </div>

            <div className="w-full max-w-5xl flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full font-bold transition-all border ${activeCategory === cat
                            ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-5xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 overflow-y-auto pr-2 scrollbar-glow">
                {filteredAvatars.map(avatar => (
                    <button
                        key={avatar.id}
                        onClick={() => {
                            onSelect(avatar.url);
                            onClose();
                        }}
                        className={`relative group aspect-square rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-110 active:scale-95 ${currentAvatar === avatar.url ? 'ring-4 ring-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]' : 'ring-2 ring-white/10 hover:ring-white/50'
                            }`}
                    >
                        <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                            <span className="text-white text-xs font-bold">{avatar.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
