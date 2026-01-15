import { ReactNode } from 'react';

interface ContentGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 2 | 3 | 4 | 6;
  className?: string;
}

export const ContentGrid = ({ 
  children, 
  columns = 2,
  gap = 3,
  className = '' 
}: ContentGridProps) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};
