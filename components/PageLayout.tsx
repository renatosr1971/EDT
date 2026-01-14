import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col min-h-screen bg-background-dark md:pl-64 ${className}`}>
            <div className="flex-1 w-full max-w-7xl mx-auto px-0 md:px-6">
                {children}
            </div>
        </div>
    );
};

export default PageLayout;
