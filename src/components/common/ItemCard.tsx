import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface ItemCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const ItemCard = ({ 
  title, 
  subtitle, 
  actions,
  children,
  className = '' 
}: ItemCardProps) => {
  return (
    <Card className={`p-4 border-2 flex items-center justify-between ${className}`}>
      <div className="min-w-0 flex-1">
        <p className="font-bold truncate">{title}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex gap-1 flex-shrink-0 ml-3">{actions}</div>}
    </Card>
  );
};
