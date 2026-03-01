import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Locale, Direction, getDirection, isRTL as checkIsRTL } from '../i18n/types';
import { loadAllTranslations } from '../i18n/config';

/**
 * Language context value interface
 */
export interface LanguageContextValue {
  /** Current active language */
  currentLanguage: Locale;
  /** Function to change the language */
  changeLanguage: (lang: Locale) => Promise<void>;
  /** Whether current language is RTL */
  isRTL: boolean;
  /** Current text direction */
  direction: Direction;
}

/**
 * Language context
 */
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * localStorage key for language preference
 */
const LANGUAGE_STORAGE_KEY = 'user-language-preference';

/**
 * Get stored language preference from localStorage
 */
const getStoredLanguage = (): Locale | null => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) {
      const preference = JSON.parse(stored);
      if (preference.locale === 'en' || preference.locale === 'ar') {
        return preference.locale;
      }
    }
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
  }
  return null;
};

/**
 * Save language preference to localStorage
 */
const saveLanguagePreference = (locale: Locale): void => {
  try {
    const preference = {
      locale,
      timestamp: Date.now(),
    };
    localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(preference));
  } catch (error) {
    console.warn('Failed to save language preference to localStorage:', error);
  }
};

/**
 * Language provider props
 */
export interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Language provider component
 * Manages language state, persistence, and document attributes
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Initialize language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState<Locale>(() => {
    return getStoredLanguage() || 'en';
  });

  /**
   * Update document attributes for the current language
   */
  const updateDocumentAttributes = useCallback((locale: Locale) => {
    const direction = getDirection(locale);
    
    // Update document direction
    document.documentElement.dir = direction;
    
    // Update document language
    document.documentElement.lang = locale;
    
    // Add/remove RTL class for styling
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }

    // Update font family based on language
    const body = document.body;
    if (locale === 'ar') {
      body.classList.remove('font-english');
      body.classList.add('font-arabic');
    } else {
      body.classList.remove('font-arabic');
      body.classList.add('font-english');
    }
  }, []);

  /**
   * Change language handler
   */
  const changeLanguage = useCallback(async (lang: Locale) => {
    try {
      // Load translations for the new language if not already loaded
      await loadAllTranslations(lang);
      
      // Change i18next language
      await i18n.changeLanguage(lang);
      
      // Update state
      setCurrentLanguage(lang);
      
      // Update document attributes
      updateDocumentAttributes(lang);
      
      // Save preference to localStorage
      saveLanguagePreference(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    }
  }, [i18n, updateDocumentAttributes]);

  // Initialize document attributes on mount and when language changes
  useEffect(() => {
    updateDocumentAttributes(currentLanguage);
  }, [currentLanguage, updateDocumentAttributes]);

  // Initialize i18next language on mount
  useEffect(() => {
    const initLanguage = async () => {
      const storedLang = getStoredLanguage();
      if (storedLang && storedLang !== i18n.language) {
        await changeLanguage(storedLang);
      }
    };
    
    initLanguage().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: LanguageContextValue = {
    currentLanguage,
    changeLanguage,
    isRTL: checkIsRTL(currentLanguage),
    direction: getDirection(currentLanguage),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use language context
 * @throws Error if used outside LanguageProvider
 */
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
