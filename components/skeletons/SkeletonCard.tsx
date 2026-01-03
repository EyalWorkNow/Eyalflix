import React from 'react';

export const SkeletonCard: React.FC = () => {
    return (
        <div className="relative flex-none w-[160px] md:w-[240px] aspect-[16/9] mx-2 my-2 bg-[#161b22] rounded-xl overflow-hidden">
            {/* Using the animate-shimmer class defined in index.html */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}/>
        </div>
    );
};