import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'card';
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon,
  title, 
  description, 
  action,
  variant = 'default',
  className = '' 
}: EmptyStateProps) => {
  const baseClasses = 'border-2 border-dashed p-8 text-center text-muted-foreground';
  const variantClasses = variant === 'card' ? 'rounded-lg bg-card' : '';

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {Icon && <Icon className="h-12 w-12 mx-auto mb-4 opacity-50" />}
      <p className="text-lg">{title}</p>
      {description && <p className="text-sm mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
