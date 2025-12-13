
import React from 'react';
import { Plus, Lock } from 'lucide-react';

interface ProfileGateProps {
    onSelectProfile: (profileId: string) => void;
}

const PROFILES = [
    { id: '1', name: 'אבא', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png', color: 'bg-blue-500' },
    { id: '2', name: 'אמא', avatar: 'https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg', color: 'bg-red-500' },
    { id: '3', name: 'ילדים', avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/bb3a8833850498.56ba69ac33f26.png', color: 'bg-green-500', isKids: true },
];

export const ProfileGate: React.FC<ProfileGateProps> = ({ onSelectProfile }) => {
    return (
        <div className="fixed inset-0 z-[200] bg-[#0d1117] flex flex-col items-center justify-center animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">מי צופה כרגע?</h1>
                <p className="text-gray-400 text-lg">בחר/י פרופיל כדי להמשיך</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {PROFILES.map((profile) => (
                    <div key={profile.id} className="group flex flex-col items-center gap-4 cursor-pointer" onClick={() => onSelectProfile(profile.id)}>
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:ring-4 group-hover:ring-cyan-500/50 group-focus:scale-110 group-focus:ring-4 group-focus:ring-cyan-500">
                            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>
                        <span className="text-gray-400 text-lg md:text-xl font-medium group-hover:text-white transition-colors">{profile.name}</span>
                    </div>
                ))}

                {/* Add Profile Button */}
                <div className="group flex flex-col items-center gap-4 cursor-pointer">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center transition-all duration-300 group-hover:border-white group-hover:bg-white/10">
                        <Plus className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-gray-500 text-lg font-medium group-hover:text-gray-300 transition-colors">הוסף פרופיל</span>
                </div>
            </div>

            <button className="mt-16 px-8 py-2 border border-gray-500 text-gray-500 font-bold tracking-widest hover:border-white hover:text-white transition-all text-sm uppercase">
                ניהול פרופילים
            </button>
        </div>
    );
};
