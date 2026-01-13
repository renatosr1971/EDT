import React from 'react';

interface PageHeaderProps {
    children: React.ReactNode;
    className?: string;
    sticky?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    children,
    className = '',
    sticky = true
}) => {
    return (
        <div className={`
      ${sticky ? 'sticky top-0 z-50' : ''} 
      bg-background-dark/90 backdrop-blur-md border-b border-white/5 
      ${className}
    `}>
            {children}
        </div>
    );
};

export default PageHeader;
