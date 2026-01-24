
import React from 'react';
import { X, Search, Sparkles } from 'lucide-react';

export const ANIME_AVATARS = [
    { id: 'luffy', name: 'Luffy', url: 'https://cdn.pixabay.com/photo/2021/11/02/10/43/luffy-6762955_1280.png', category: 'Shonen' },
    { id: 'zoro', name: 'Zoro', url: 'https://i.pinimg.com/736x/8d/d5/4d/8dd54d3cd2c4c375635f299d86506d34.jpg', category: 'Shonen' },
    { id: 'naruto', name: 'Naruto', url: 'https://wallpapers.com/images/hd/naruto-profile-pictures-p67m02i0v16w8n6t.jpg', category: 'Shonen' },
    { id: 'sasuke', name: 'Sasuke', url: 'https://i.pinimg.com/736x/ec/9a/c0/ec9ac0e6f6631ad1875155f6966144e0.jpg', category: 'Shonen' },
    { id: 'gojo', name: 'Gojo', url: 'https://i.pinimg.com/736x/21/cf/3e/21cf3e680c65538e1467beaf8515c0a1.jpg', category: 'Shonen' },
    { id: 'tanjiro', name: 'Tanjiro', url: 'https://i.pinimg.com/736x/2d/31/54/2d31542f7c6e6d30d17d599b5377f074.jpg', category: 'Shonen' },
    { id: 'nezuko', name: 'Nezuko', url: 'https://i.pinimg.com/736x/0a/63/05/0a63056094caeaeb9338f7147895f573.jpg', category: 'Cute' },
    { id: 'mikasa', name: 'Mikasa', url: 'https://i.pinimg.com/736x/6f/91/92/6f91925b6833cc180e90c8e31006ee74.jpg', category: 'Badass' },
    { id: 'anya', name: 'Anya', url: 'https://i.pinimg.com/736x/2b/96/96/2b96968db86cb3f9a785da27e69f80a4.jpg', category: 'Cute' },
    { id: 'chopper', name: 'Chopper', url: 'https://i.pinimg.com/736x/91/96/96/9196968db86cb3f9a785da27e69f80a4.jpg', category: 'Cute' },
    { id: 'pikachu', name: 'Pikachu', url: 'https://i.pinimg.com/736x/f6/b6/b6/f6b6b6b6b6b6b6b6b6b6b6b6b6b6b6b6.jpg', category: 'Cute' },
    { id: 'goku', name: 'Goku', url: 'https://i.pinimg.com/736x/1a/1a/1a/1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a.jpg', category: 'Shonen' },
].map(a => ({
    ...a,
    url: a.id === 'chopper' ? 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/bb3a8833850498.56ba69ac33f26.png' :
        a.id === 'luffy' ? 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png' : a.url
}));

interface AvatarGalleryProps {
    onSelect: (url: string) => void;
    onClose: () => void;
    currentAvatar?: string;
}

export const AvatarGallery: React.FC<AvatarGalleryProps> = ({ onSelect, onClose, currentAvatar }) => {
    const categories = ['All', 'Shonen', 'Cute', 'Badass'];
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
