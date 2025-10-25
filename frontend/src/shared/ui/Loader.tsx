import React from 'react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
                                                  size = 'md',
                                                  text,
                                                  fullScreen = false,
                                              }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
    };

    const loader = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div
                    className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}></div>
                <div
                    className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
            </div>
            {text && (
                <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                {loader}
            </div>
        );
    }

    return loader;
};

export const SkeletonLoader: React.FC<{ className?: string }> = ({className = ''}) => {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
    );
};
