// Theme Registry - centrální definice všech themes

export type ThemeMode = 'light' | 'dark';

export type ThemeId = 'brutalist' | 'fresh-modern' | 'glassmorphism' | 'retro';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  // Visual preview colors (for theme selector UI)
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
  // Special features
  features: {
    hasBackgroundImage: boolean;
    hasGlassEffect: boolean;
    hasAnimations: boolean;
  };
}

export const themes: Record<ThemeId, ThemeConfig> = {
  brutalist: {
    id: 'brutalist',
    name: 'Minimal Brutalist',
    description: 'Čistý černobílý design s ostrými hranami a tvrdými stíny',
    preview: {
      primary: '#000000',
      secondary: '#f5f5f5',
      accent: '#e5e5e5',
    },
    features: {
      hasBackgroundImage: false,
      hasGlassEffect: false,
      hasAnimations: false,
    },
  },
  'fresh-modern': {
    id: 'fresh-modern',
    name: 'Fresh Modern',
    description: 'Světlý bílo-zelený čistý vzdušný design',
    preview: {
      primary: '#22c55e',
      secondary: '#f0fdf4',
      accent: '#86efac',
    },
    features: {
      hasBackgroundImage: false,
      hasGlassEffect: false,
      hasAnimations: true,
    },
  },
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Moderní průhlednost s blur efekty a background image',
    preview: {
      primary: '#3b82f6',
      secondary: 'rgba(255,255,255,0.7)',
      accent: '#a855f7',
    },
    features: {
      hasBackgroundImage: true,
      hasGlassEffect: true,
      hasAnimations: true,
    },
  },
  retro: {
    id: 'retro',
    name: 'Retro 90s',
    description: 'Pastelové barvy, tučné obrysy a hravý design',
    preview: {
      primary: '#ec4899',
      secondary: '#fef3c7',
      accent: '#facc15',
    },
    features: {
      hasBackgroundImage: false,
      hasGlassEffect: false,
      hasAnimations: true,
    },
  },
};

export const themeIds = Object.keys(themes) as ThemeId[];

export const getTheme = (id: ThemeId): ThemeConfig => themes[id];

export const isValidThemeId = (id: string): id is ThemeId => {
  return id in themes;
};
