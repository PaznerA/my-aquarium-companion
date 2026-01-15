import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
  hideNavPadding?: boolean;
}

export const Layout = ({ children, hideNavPadding }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className={`md:ml-72 ${hideNavPadding ? '' : 'pt-16 md:pt-0 pb-20 md:pb-0'} min-h-screen`}>
        <div className={hideNavPadding ? '' : 'p-4 md:p-8'}>
          {children}
        </div>
      </main>
    </div>
  );
};
