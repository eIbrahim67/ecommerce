import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, waitFor } from '@testing-library/react';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageProvider } from '../LanguageContext';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import type { Locale } from '../../i18n/types';

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

/**
 * Property-Based Test: Document Direction Setting
 * Feature: arabic-language-support
 * Property 8: Document Direction Setting
 * 
 * **Validates: Requirements 3.1, 3.2**
 * 
 * For any locale, setting the language should apply the correct document 
 * direction (RTL for Arabic, LTR for English).
 */
describe('Property Test: Document Direction Setting', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset i18n to English
    i18n.changeLanguage('en');
    
    // Reset document attributes to default state
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    document.documentElement.classList.remove('rtl');
    document.body.classList.remove('font-arabic', 'font-english');
  });

  it('should apply correct document direction for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary locale
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          // Render hook
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Change to the locale
          await result.current.changeLanguage(locale);
          
          // Wait for language change to complete
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(locale);
          });
          
          // Determine expected direction based on locale
          const expectedDirection = locale === 'ar' ? 'rtl' : 'ltr';
          
          // Verify document direction is set correctly
          expect(document.documentElement.dir).toBe(expectedDirection);
          
          // Verify the direction matches the locale's expected direction
          if (locale === 'ar') {
            expect(document.documentElement.dir).toBe('rtl');
          } else {
            expect(document.documentElement.dir).toBe('ltr');
          }
        }
      ),
      {
        // Run at least 100 iterations as specified in the design
        numRuns: 100,
      }
    );
  });

  it('should apply RTL direction for Arabic locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: always Arabic
        fc.constant<Locale>('ar'),
        async (locale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe('ar');
          });
          
          // Verify RTL direction is applied
          expect(document.documentElement.dir).toBe('rtl');
          expect(result.current.direction).toBe('rtl');
          expect(result.current.isRTL).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should apply LTR direction for English locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: always English
        fc.constant<Locale>('en'),
        async (locale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe('en');
          });
          
          // Verify LTR direction is applied
          expect(document.documentElement.dir).toBe('ltr');
          expect(result.current.direction).toBe('ltr');
          expect(result.current.isRTL).toBe(false);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should update document lang attribute for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(locale);
          });
          
          // Verify lang attribute matches the locale
          expect(document.documentElement.lang).toBe(locale);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should add RTL class for Arabic and remove for English', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(locale);
          });
          
          // Verify RTL class is present for Arabic, absent for English
          if (locale === 'ar') {
            expect(document.documentElement.classList.contains('rtl')).toBe(true);
          } else {
            expect(document.documentElement.classList.contains('rtl')).toBe(false);
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain consistent direction across multiple language changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: sequence of language changes
        fc.array(fc.constantFrom<Locale>('en', 'ar'), { minLength: 2, maxLength: 5 }),
        async (localeSequence) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          for (const locale of localeSequence) {
            await result.current.changeLanguage(locale);
            
            await waitFor(() => {
              expect(result.current.currentLanguage).toBe(locale);
            });
            
            // Verify direction is correct after each change
            const expectedDirection = locale === 'ar' ? 'rtl' : 'ltr';
            expect(document.documentElement.dir).toBe(expectedDirection);
            expect(document.documentElement.lang).toBe(locale);
            expect(result.current.direction).toBe(expectedDirection);
            expect(result.current.isRTL).toBe(locale === 'ar');
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  }, 15000); // Increase timeout for multiple changes

  it('should apply correct font class for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(locale);
          });
          
          // Verify font class is applied correctly
          if (locale === 'ar') {
            expect(document.body.classList.contains('font-arabic')).toBe(true);
            expect(document.body.classList.contains('font-english')).toBe(false);
          } else {
            expect(document.body.classList.contains('font-english')).toBe(true);
            expect(document.body.classList.contains('font-arabic')).toBe(false);
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should synchronize all direction-related attributes for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(locale);
          });
          
          const expectedDirection = locale === 'ar' ? 'rtl' : 'ltr';
          const expectedIsRTL = locale === 'ar';
          
          // All direction-related attributes should be synchronized
          expect(document.documentElement.dir).toBe(expectedDirection);
          expect(document.documentElement.lang).toBe(locale);
          expect(result.current.direction).toBe(expectedDirection);
          expect(result.current.isRTL).toBe(expectedIsRTL);
          expect(document.documentElement.classList.contains('rtl')).toBe(expectedIsRTL);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should persist direction settings after page reload simulation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          // First render: set language
          const { result, unmount } = renderHook(() => useLanguage(), { wrapper });
          
          await result.current.changeLanguage(locale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(locale);
          });
          
          const expectedDirection = locale === 'ar' ? 'rtl' : 'ltr';
          expect(document.documentElement.dir).toBe(expectedDirection);
          
          // Unmount to simulate page unload
          unmount();
          
          // Reset document attributes to simulate fresh page load
          document.documentElement.dir = '';
          document.documentElement.lang = '';
          document.documentElement.classList.remove('rtl');
          document.body.classList.remove('font-arabic', 'font-english');
          
          // Second render: should restore from localStorage
          const { result: newResult } = renderHook(() => useLanguage(), { wrapper });
          
          await waitFor(() => {
            expect(newResult.current.currentLanguage).toBe(locale);
          });
          
          // Verify direction is restored correctly
          expect(document.documentElement.dir).toBe(expectedDirection);
          expect(document.documentElement.lang).toBe(locale);
          expect(newResult.current.direction).toBe(expectedDirection);
          expect(newResult.current.isRTL).toBe(locale === 'ar');
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle rapid language switches correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: sequence of rapid language changes
        fc.array(fc.constantFrom<Locale>('en', 'ar'), { minLength: 3, maxLength: 6 }),
        async (localeSequence) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Perform rapid language switches
          for (const locale of localeSequence) {
            await result.current.changeLanguage(locale);
          }
          
          // Wait for final language to be set
          const finalLocale = localeSequence[localeSequence.length - 1];
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(finalLocale);
          });
          
          // Verify final direction is correct
          const expectedDirection = finalLocale === 'ar' ? 'rtl' : 'ltr';
          expect(document.documentElement.dir).toBe(expectedDirection);
          expect(document.documentElement.lang).toBe(finalLocale);
          expect(result.current.direction).toBe(expectedDirection);
        }
      ),
      {
        numRuns: 50, // Reduced runs for performance
      }
    );
  }, 20000); // Increase timeout for rapid switches
});
