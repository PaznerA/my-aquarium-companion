import { ReactNode } from 'react';
import { NavigationWrapper } from './NavigationWrapper';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  hideNavPadding?: boolean;
}

export const Layout = ({ children, hideNavPadding }: LayoutProps) => {
  const { themeId, backgroundImage } = useTheme();
  
  const isGlassmorphism = themeId === 'glassmorphism';

  return (
    <div 
      className={cn(
        "min-h-screen relative",
        isGlassmorphism ? "glass-layout" : "bg-background"
      )}
    >
      {/* Parallax Background for Glassmorphism */}
      {isGlassmorphism && (
        <div 
          className="fixed inset-0 z-0 glass-background"
          style={{
            backgroundImage: backgroundImage 
              ? `url(${backgroundImage})` 
              : 'linear-gradient(135deg, hsl(220 80% 55% / 0.1), hsl(280 70% 60% / 0.1))',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-[2px]" />
        </div>
      )}
      
      <NavigationWrapper />
      
      <main 
        className={cn(
          "relative z-10",
          // Desktop: left margin for sidebar
          "md:ml-72",
          // Mobile: top padding for header, bottom for nav
          hideNavPadding ? '' : 'pt-16 md:pt-0 pb-24 md:pb-0',
          "min-h-screen"
        )}
      >
        <div className={cn(
          hideNavPadding ? '' : 'p-4 md:p-8',
          // Extra spacing for glassmorphism
          isGlassmorphism && "md:p-10"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};
