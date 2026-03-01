import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguageContext } from '../LanguageContext';
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

describe('LanguageContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset i18n to English
    i18n.changeLanguage('en');
    
    // Reset document attributes
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    document.documentElement.classList.remove('rtl');
    
    // Reset body font classes
    document.body.classList.remove('font-arabic', 'font-english');
  });

  afterEach(() => {
    // Clean up after each test
    vi.restoreAllMocks();
  });

  describe('Default Language Behavior', () => {
    it('should default to English when no preference exists in localStorage', () => {
      // Ensure localStorage is empty
      expect(localStorage.getItem('user-language-preference')).toBeNull();
      
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
    });

    it('should set isRTL to false for English default', () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.isRTL).toBe(false);
    });

    it('should set direction to ltr for English default', () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.direction).toBe('ltr');
    });

    it('should set document attributes for English default', () => {
      renderHook(() => useLanguageContext(), { wrapper });
      
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.classList.contains('rtl')).toBe(false);
    });
  });

  describe('Language Change Updates', () => {
    it('should update currentLanguage when changing to Arabic', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
      });
    });

    it('should update isRTL when changing to Arabic', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.isRTL).toBe(false);
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.isRTL).toBe(true);
      });
    });

    it('should update direction when changing to Arabic', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.direction).toBe('ltr');
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.direction).toBe('rtl');
      });
    });

    it('should update all context values when changing from Arabic to English', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // First change to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
        expect(result.current.isRTL).toBe(true);
        expect(result.current.direction).toBe('rtl');
      });
      
      // Then change back to English
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
        expect(result.current.isRTL).toBe(false);
        expect(result.current.direction).toBe('ltr');
      });
    });

    it('should update document.dir when changing language', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(document.documentElement.dir).toBe('rtl');
      });
      
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(document.documentElement.dir).toBe('ltr');
      });
    });

    it('should update document.lang when changing language', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('ar');
      });
      
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
      });
    });

    it('should add rtl class when changing to Arabic', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(document.documentElement.classList.contains('rtl')).toBe(false);
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('rtl')).toBe(true);
      });
    });

    it('should remove rtl class when changing to English', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // First change to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('rtl')).toBe(true);
      });
      
      // Then change back to English
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('rtl')).toBe(false);
      });
    });

    it('should add font-arabic class to body when changing to Arabic', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(document.body.classList.contains('font-arabic')).toBe(false);
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(document.body.classList.contains('font-arabic')).toBe(true);
        expect(document.body.classList.contains('font-english')).toBe(false);
      });
    });

    it('should add font-english class to body when changing to English', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // First change to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(document.body.classList.contains('font-arabic')).toBe(true);
      });
      
      // Then change back to English
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(document.body.classList.contains('font-english')).toBe(true);
        expect(document.body.classList.contains('font-arabic')).toBe(false);
      });
    });
  });

  describe('localStorage Persistence', () => {
    it('should save language preference to localStorage when changing language', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        const stored = localStorage.getItem('user-language-preference');
        expect(stored).not.toBeNull();
        
        const preference = JSON.parse(stored!);
        expect(preference.locale).toBe('ar');
        expect(preference.timestamp).toBeDefined();
        expect(typeof preference.timestamp).toBe('number');
      });
    });

    it('should load language preference from localStorage on initialization', async () => {
      // Set up localStorage with Arabic preference
      const preference = {
        locale: 'ar',
        timestamp: Date.now(),
      };
      localStorage.setItem('user-language-preference', JSON.stringify(preference));
      
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // Wait for initialization to complete
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
      }, { timeout: 3000 });
    });

    it('should persist language across multiple changes', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // Change to Arabic
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        const stored = localStorage.getItem('user-language-preference');
        const preference = JSON.parse(stored!);
        expect(preference.locale).toBe('ar');
      });
      
      // Change back to English
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        const stored = localStorage.getItem('user-language-preference');
        const preference = JSON.parse(stored!);
        expect(preference.locale).toBe('en');
      });
    });

    it('should update timestamp when saving preference', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      const beforeTimestamp = Date.now();
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        const stored = localStorage.getItem('user-language-preference');
        const preference = JSON.parse(stored!);
        expect(preference.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
        expect(preference.timestamp).toBeLessThanOrEqual(Date.now());
      });
    });
  });

  describe('localStorage Error Handling', () => {
    it('should handle localStorage unavailability gracefully when reading', () => {
      // Mock localStorage.getItem to throw an error
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });
      
      // Mock console.warn to verify warning is logged
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Should not throw, should default to English
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to read language preference from localStorage:',
        expect.any(Error)
      );
      
      getItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle localStorage unavailability gracefully when writing', async () => {
      // Mock localStorage.setItem to throw an error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });
      
      // Mock console.warn to verify warning is logged
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // Language change should still work, just not persist
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Failed to save language preference to localStorage:',
          expect.any(Error)
        );
      });
      
      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle malformed JSON in localStorage gracefully', () => {
      // Set invalid JSON in localStorage
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid json {');
      
      // Mock console.warn to verify warning is logged
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Should not throw, should default to English
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle invalid locale in localStorage gracefully', () => {
      // Set invalid locale in localStorage
      const invalidPreference = {
        locale: 'fr', // Unsupported locale
        timestamp: Date.now(),
      };
      localStorage.setItem('user-language-preference', JSON.stringify(invalidPreference));
      
      // Should default to English
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current.currentLanguage).toBe('en');
    });
  });

  describe('Context Provider', () => {
    it('should provide all required context values', () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(result.current).toHaveProperty('currentLanguage');
      expect(result.current).toHaveProperty('changeLanguage');
      expect(result.current).toHaveProperty('isRTL');
      expect(result.current).toHaveProperty('direction');
    });

    it('should provide a function for changeLanguage', () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      expect(typeof result.current.changeLanguage).toBe('function');
    });

    it('should throw error when useLanguageContext is used outside provider', () => {
      // Mock console.error to avoid noise in test output
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useLanguageContext());
      }).toThrow('useLanguageContext must be used within a LanguageProvider');
      
      consoleError.mockRestore();
    });
  });

  describe('i18next Integration', () => {
    it('should update i18next language when changing language', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(i18n.language).toBe('ar');
      });
    });

    it('should maintain i18next language sync with context', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      await result.current.changeLanguage('ar');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('ar');
        expect(i18n.language).toBe('ar');
      });
      
      await result.current.changeLanguage('en');
      
      await waitFor(() => {
        expect(result.current.currentLanguage).toBe('en');
        expect(i18n.language).toBe('en');
      });
    });
  });

  describe('Error Handling', () => {
    it('should catch and log errors during language change', async () => {
      const { result } = renderHook(() => useLanguageContext(), { wrapper });
      
      // Mock console.error to capture error logging
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock loadAllTranslations to throw an error
      const { loadAllTranslations } = await import('../../i18n/config');
      const loadSpy = vi.spyOn(await import('../../i18n/config'), 'loadAllTranslations')
        .mockRejectedValueOnce(new Error('Translation load failed'));
      
      // Attempt to change language - should throw
      try {
        await result.current.changeLanguage('ar');
        // If we get here, the test should fail
        expect.fail('Expected changeLanguage to throw an error');
      } catch (error) {
        // Error should be thrown
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Translation load failed');
      }
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to change language:',
        expect.any(Error)
      );
      
      // Restore mocks
      loadSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
