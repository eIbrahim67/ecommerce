import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLanguage } from '../useLanguage';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';

/**
 * Test wrapper that provides necessary context providers
 */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </I18nextProvider>
);

describe('useLanguage Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset i18n to English
    i18n.changeLanguage('en');
    
    // Reset document attributes
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    document.documentElement.classList.remove('rtl');
  });

  describe('Hook Initialization', () => {
    it('should return all required properties', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(result.current).toHaveProperty('currentLanguage');
      expect(result.current).toHaveProperty('changeLanguage');
      expect(result.current).toHaveProperty('isRTL');
      expect(result.current).toHaveProperty('t');
    });

    it('should initialize with English as default language', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
    });

    it('should initialize with isRTL as false for English', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(result.current.isRTL).toBe(false);
    });

    it('should provide a working translation function', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(typeof result.current.t).toBe('function');
      
      // Test that translation function works (common is default namespace)
      const translation = result.current.t('buttons.login');
      expect(typeof translation).toBe('string');
      expect(translation.length).toBeGreaterThan(0);
    });
  });

  describe('Language Switching', () => {
    it('should change language from English to Arabic', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
      });
    });

    it('should change language from Arabic to English', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      // First switch to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
      });
      
      // Then switch back to English
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
      });
    });

    it('should update isRTL when changing to Arabic', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(result.current.isRTL).toBe(false);
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should update isRTL when changing to English', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      // First switch to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.isRTL).toBe(true);
      });
      
      // Then switch back to English
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(result.current.isRTL).toBe(false);
      });
    });

    it('should update translation function to return Arabic translations', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      // Check English translation
      expect(result.current.t('common:buttons.login')).toBe('Login');
      
      // Switch to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.t('common:buttons.login')).toBe('تسجيل الدخول');
      });
    });
  });

  describe('Translation Function', () => {
    it('should translate simple keys', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      const translation = result.current.t('common:buttons.submit');
      expect(translation).toBe('Submit');
    });

    it('should translate nested keys', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      const translation = result.current.t('navigation:header.home');
      expect(translation).toBe('Home');
    });

    it('should return key as fallback for missing translations', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      const translation = result.current.t('common:nonexistent.key');
      expect(translation).toBe('nonexistent.key');
    });

    it('should support variable interpolation', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      // Add a test translation with variable
      i18n.addResource('en', 'common', 'testGreeting', 'Hello, {{name}}!');
      
      const translation = result.current.t('common:testGreeting', { name: 'Alice' });
      expect(translation).toBe('Hello, Alice!');
    });

    it('should translate in Arabic after language change', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        const translation = result.current.t('common:buttons.cancel');
        expect(translation).toBe('إلغاء');
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside LanguageProvider', () => {
      // Mock console.error to avoid noise in test output
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguageContext must be used within a LanguageProvider');
      
      consoleError.mockRestore();
    });
  });

  describe('Integration with LanguageContext', () => {
    it('should reflect context changes', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      const initialLanguage = result.current.currentLanguage;
      expect(initialLanguage).toBe('en');
      
      // Change language through the hook
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should provide changeLanguage function that updates context', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(typeof result.current.changeLanguage).toBe('function');
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
      });
    });
  });

  describe('Type Safety', () => {
    it('should only accept valid locale values', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      // TypeScript should prevent invalid locales at compile time
      // At runtime, we test that valid locales work
      await result.current.changeLanguage('en');
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
      });
      
      await result.current.changeLanguage('ar');
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
      });
    });
  });
});
