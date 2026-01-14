import { useTheme } from '@/hooks/useTheme';
import { Navigation } from './Navigation';
import { GlassmorphismNavigation } from './GlassmorphismNavigation';

/**
 * Theme-aware Navigation wrapper
 * Renders different navigation styles based on active theme
 */
export const NavigationWrapper = () => {
  const { themeId } = useTheme();

  // Glassmorphism has its own unique navigation
  if (themeId === 'glassmorphism') {
    return <GlassmorphismNavigation />;
  }

  // Default navigation for other themes
  return <Navigation />;
};
