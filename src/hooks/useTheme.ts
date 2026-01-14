import { useState, useEffect, useCallback } from 'react';
import { ThemeId, ThemeMode, isValidThemeId, themes } from '@/themes';

const THEME_STORAGE_KEY = 'aquarium-theme';
const MODE_STORAGE_KEY = 'aquarium-theme-mode';
const BG_IMAGE_STORAGE_KEY = 'aquarium-bg-image';

interface ThemeState {
  themeId: ThemeId;
  mode: ThemeMode;
  backgroundImage: string | null;
}

const loadThemeState = (): ThemeState => {
  if (typeof window === 'undefined') {
    return { themeId: 'brutalist', mode: 'light', backgroundImage: null };
  }
  
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const storedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
  const storedBgImage = localStorage.getItem(BG_IMAGE_STORAGE_KEY);
  
  const themeId: ThemeId = storedTheme && isValidThemeId(storedTheme) 
    ? storedTheme 
    : 'brutalist';
    
  const mode: ThemeMode = storedMode 
    ? storedMode 
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
  return { 
    themeId, 
    mode, 
    backgroundImage: storedBgImage 
  };
};

export const useTheme = () => {
  const [state, setState] = useState<ThemeState>(loadThemeState);

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove(
      'theme-brutalist', 
      'theme-fresh-modern', 
      'theme-glassmorphism', 
      'theme-retro',
      'dark'
    );
    
    // Add current theme class
    root.classList.add(`theme-${state.themeId}`);
    
    // Add dark mode if needed
    if (state.mode === 'dark') {
      root.classList.add('dark');
    }
    
    // Apply background image for glassmorphism
    if (state.themeId === 'glassmorphism' && state.backgroundImage) {
      root.style.setProperty('--background-image', `url(${state.backgroundImage})`);
      document.body.style.backgroundImage = `var(--background-image)`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      root.style.removeProperty('--background-image');
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    }
    
    // Persist to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, state.themeId);
    localStorage.setItem(MODE_STORAGE_KEY, state.mode);
    if (state.backgroundImage) {
      localStorage.setItem(BG_IMAGE_STORAGE_KEY, state.backgroundImage);
    } else {
      localStorage.removeItem(BG_IMAGE_STORAGE_KEY);
    }
  }, [state]);

  const setThemeId = useCallback((themeId: ThemeId) => {
    setState(prev => ({ ...prev, themeId }));
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const toggleMode = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      mode: prev.mode === 'light' ? 'dark' : 'light' 
    }));
  }, []);

  const setBackgroundImage = useCallback((url: string | null) => {
    setState(prev => ({ ...prev, backgroundImage: url }));
  }, []);

  // Legacy compatibility
  const theme = state.mode;
  const setTheme = setMode;
  const toggleTheme = toggleMode;

  return { 
    // New API
    themeId: state.themeId,
    mode: state.mode,
    backgroundImage: state.backgroundImage,
    themeConfig: themes[state.themeId],
    setThemeId,
    setMode,
    toggleMode,
    setBackgroundImage,
    
    // Legacy API (for backwards compatibility)
    theme,
    setTheme,
    toggleTheme,
  };
};
