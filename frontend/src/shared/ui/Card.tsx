import React, {HTMLAttributes} from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              variant = 'default',
                                              padding = 'md',
                                              className = '',
                                              ...props
                                          }) => {
    const baseClasses = 'rounded-2xl bg-white dark:bg-gray-800 transition-all duration-200';

    const variantClasses = {
        default: 'border border-gray-200 dark:border-gray-700',
        bordered: 'border-2 border-primary',
        elevated: 'shadow-xl hover:shadow-2xl',
    };

    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          children,
                                                          className = '',
                                                          ...props
                                                      }) => {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {title && (
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {title}
                </h3>
            )}
            {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                </p>
            )}
            {children}
        </div>
    );
};

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
                                                                          children,
                                                                          className = '',
                                                                          ...props
                                                                      }) => {
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
                                                                         children,
                                                                         className = '',
                                                                         ...props
                                                                     }) => {
    return (
        <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`} {...props}>
            {children}
        </div>
    );
};
