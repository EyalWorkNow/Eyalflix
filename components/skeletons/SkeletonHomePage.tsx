import React from 'react';
import { SkeletonRow } from './SkeletonRow';

export const SkeletonHomePage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            {/* Skeleton Hero */}
            <div className="relative h-[70vh] md:h-[85vh] w-full bg-[#161b22]">
                <div className="absolute bottom-12 md:bottom-20 left-4 md:left-12 space-y-4">
                    <div className="h-6 w-40 bg-gray-800 rounded-md" />
                    <div className="h-16 w-3/4 md:w-1/2 bg-gray-800 rounded-lg" />
                    <div className="h-5 w-1/2 md:w-1/3 bg-gray-800 rounded-md" />
                </div>
            </div>

            {/* Skeleton Rows - Updated margins to match App.tsx */}
            <div className="relative z-10 mt-4 md:mt-8 space-y-8 md:space-y-12 pb-12">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
            </div>
        </div>
    );
};