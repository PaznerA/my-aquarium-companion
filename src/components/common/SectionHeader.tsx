import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  count?: number;
  actions?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ 
  title, 
  count, 
  actions,
  className = '' 
}: SectionHeaderProps) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className="text-xl font-bold">
        {title}
        {count !== undefined && <span className="ml-1">({count})</span>}
      </h2>
      {actions}
    </div>
  );
};
