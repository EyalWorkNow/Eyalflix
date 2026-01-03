import React from 'react';
import { SkeletonCard } from './SkeletonCard';

export const SkeletonRow: React.FC = () => {
    return (
        <div className="px-4 md:px-12">
            <div className="h-7 w-48 bg-[#161b22] rounded-md mb-4" />
            <div className="flex overflow-hidden gap-4 py-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        </div>
    );
};
