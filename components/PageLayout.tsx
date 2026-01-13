import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
    className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col min-h-full max-w-lg mx-auto bg-background-dark ${className}`}>
            {children}
        </div>
    );
};

export default PageLayout;
