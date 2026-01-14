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
      flex items-center
    `}>
            {/* Mobile-only avatar or brand indicator can go here if needed, 
                but we'll keep it simple and just ensure children (headers) handle it 
                or add a small global profile circle on the left. */}
            <div className="md:hidden ml-4 size-8 rounded-full overflow-hidden ring-1 ring-primary/20 shrink-0">
                <img
                    src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    alt="Profile"
                    className="size-full object-cover"
                />
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default PageHeader;
