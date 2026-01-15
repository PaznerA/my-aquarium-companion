import { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageWrapper = ({ 
  children, 
  className = '',
  maxWidth 
}: PageWrapperProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: '',
  };

  const widthClass = maxWidth ? maxWidthClasses[maxWidth] : '';

  return (
    <div className={`space-y-6 ${widthClass} ${className}`}>
      {children}
    </div>
  );
};
