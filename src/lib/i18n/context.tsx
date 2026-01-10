import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language, UnitSystem, Translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
  t: Translations;
  // Unit conversion helpers
  formatVolume: (liters: number) => string;
  formatTemperature: (celsius: number) => string;
  parseVolume: (value: number) => number; // Convert from display unit to liters
  parseTemperature: (value: number) => number; // Convert from display unit to celsius
  volumeUnit: string;
  temperatureUnit: string;
}

const LANGUAGE_KEY = 'aquarium-journal-language';
const UNITS_KEY = 'aquarium-journal-units';

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === 'cs' || stored === 'en') return stored;
    // Auto-detect from browser
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('cs') || browserLang.startsWith('sk')) return 'cs';
    return 'en';
  });

  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    const stored = localStorage.getItem(UNITS_KEY);
    if (stored === 'metric' || stored === 'imperial') return stored;
    return 'metric';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const setUnitSystem = useCallback((system: UnitSystem) => {
    setUnitSystemState(system);
    localStorage.setItem(UNITS_KEY, system);
  }, []);

  // Unit conversion functions
  const formatVolume = useCallback((liters: number): string => {
    if (unitSystem === 'imperial') {
      const gallons = liters * 0.264172;
      return `${gallons.toFixed(1)} gal`;
    }
    return `${liters} L`;
  }, [unitSystem]);

  const formatTemperature = useCallback((celsius: number): string => {
    if (unitSystem === 'imperial') {
      const fahrenheit = (celsius * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }
    return `${celsius}°C`;
  }, [unitSystem]);

  const parseVolume = useCallback((value: number): number => {
    if (unitSystem === 'imperial') {
      return value * 3.78541; // gallons to liters
    }
    return value;
  }, [unitSystem]);

  const parseTemperature = useCallback((value: number): number => {
    if (unitSystem === 'imperial') {
      return (value - 32) * 5/9; // fahrenheit to celsius
    }
    return value;
  }, [unitSystem]);

  const t = translations[language];
  const volumeUnit = unitSystem === 'imperial' ? 'gal' : 'L';
  const temperatureUnit = unitSystem === 'imperial' ? '°F' : '°C';

  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      unitSystem,
      setUnitSystem,
      t,
      formatVolume,
      formatTemperature,
      parseVolume,
      parseTemperature,
      volumeUnit,
      temperatureUnit,
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
