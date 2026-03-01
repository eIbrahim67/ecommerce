import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, waitFor } from '@testing-library/react';
import { useLanguage } from '../useLanguage';
import { LanguageProvider } from '../../contexts/LanguageContext';
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
 * Property-Based Test: Language Toggle
 * Feature: arabic-language-support
 * Property 1: Language Toggle
 * 
 * **Validates: Requirements 1.1**
 * 
 * For any initial language state (English or Arabic), when the language 
 * switcher is triggered, the system should change to the opposite language.
 */
describe('Property Test: Language Toggle', () => {
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

  it('should toggle to opposite language from any initial language state', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary initial locale
        fc.constantFrom<Locale>('en', 'ar'),
        async (initialLocale) => {
          // Render hook with initial language
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Set initial language
          await result.current.changeLanguage(initialLocale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(initialLocale);
          });
          
          // Determine the opposite language
          const oppositeLocale: Locale = initialLocale === 'en' ? 'ar' : 'en';
          
          // Toggle language
          await result.current.changeLanguage(oppositeLocale);
          
          // Verify language changed to opposite
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(oppositeLocale);
            expect(result.current.currentLanguage).not.toBe(initialLocale);
          });
          
          // Verify the new language is a valid locale
          expect(['en', 'ar']).toContain(result.current.currentLanguage);
        }
      ),
      {
        // Run at least 100 iterations as specified in the design
        numRuns: 100,
      }
    );
  });

  it('should update isRTL flag correctly when toggling from any initial language', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (initialLocale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Set initial language
          await result.current.changeLanguage(initialLocale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(initialLocale);
          });
          
          const initialIsRTL = result.current.isRTL;
          
          // Toggle to opposite language
          const oppositeLocale: Locale = initialLocale === 'en' ? 'ar' : 'en';
          await result.current.changeLanguage(oppositeLocale);
          
          // Verify isRTL changed appropriately
          await waitFor(() => {
            const newIsRTL = result.current.isRTL;
            
            // isRTL should be true for Arabic, false for English
            if (oppositeLocale === 'ar') {
              expect(newIsRTL).toBe(true);
            } else {
              expect(newIsRTL).toBe(false);
            }
            
            // isRTL should have changed from initial state
            expect(newIsRTL).not.toBe(initialIsRTL);
          });
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should update document direction when toggling from any initial language', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (initialLocale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Set initial language
          await result.current.changeLanguage(initialLocale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(initialLocale);
          });
          
          // Toggle to opposite language
          const oppositeLocale: Locale = initialLocale === 'en' ? 'ar' : 'en';
          await result.current.changeLanguage(oppositeLocale);
          
          // Verify document direction updated
          await waitFor(() => {
            const expectedDir = oppositeLocale === 'ar' ? 'rtl' : 'ltr';
            expect(document.documentElement.dir).toBe(expectedDir);
            expect(document.documentElement.lang).toBe(oppositeLocale);
          });
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should provide working translation function after toggling from any initial language', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (initialLocale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Set initial language
          await result.current.changeLanguage(initialLocale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(initialLocale);
          });
          
          // Toggle to opposite language
          const oppositeLocale: Locale = initialLocale === 'en' ? 'ar' : 'en';
          await result.current.changeLanguage(oppositeLocale);
          
          // Verify translation function works in new language
          await waitFor(() => {
            const translation = result.current.t('common:buttons.login');
            
            // Translation should be a non-empty string
            expect(typeof translation).toBe('string');
            expect(translation.length).toBeGreaterThan(0);
            
            // Translation should match expected language
            if (oppositeLocale === 'ar') {
              expect(translation).toBe('تسجيل الدخول');
            } else {
              expect(translation).toBe('Login');
            }
          });
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should allow multiple toggles in sequence from any initial language', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (initialLocale) => {
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Set initial language
          await result.current.changeLanguage(initialLocale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(initialLocale);
          });
          
          // Toggle multiple times (reduced to 2 toggles for performance)
          let currentLocale = initialLocale;
          
          for (let i = 0; i < 2; i++) {
            const nextLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';
            await result.current.changeLanguage(nextLocale);
            
            await waitFor(() => {
              expect(result.current.currentLanguage).toBe(nextLocale);
            });
            
            currentLocale = nextLocale;
          }
          
          // After 2 toggles from initial, we should be back at initial language
          expect(result.current.currentLanguage).toBe(initialLocale);
        }
      ),
      {
        numRuns: 100,
      }
    );
  }, 10000); // Increase timeout to 10 seconds for this test
});

/**
 * Property-Based Test: Language Preference Persistence Round-Trip
 * Feature: arabic-language-support
 * Property 2: Language Preference Persistence Round-Trip
 * 
 * **Validates: Requirements 1.2, 1.3**
 * 
 * For any language selection (English or Arabic), saving the preference to 
 * localStorage and then loading it should return the same language value.
 */
describe('Property Test: Language Preference Persistence Round-Trip', () => {
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

  it('should persist and load the same language value for any language selection', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary locale to save
        fc.constantFrom<Locale>('en', 'ar'),
        async (selectedLocale) => {
          // Render hook
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Change to selected language (this should save to localStorage)
          await result.current.changeLanguage(selectedLocale);
          
          // Wait for language change to complete
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(selectedLocale);
          });
          
          // Verify localStorage contains the saved preference
          const storedValue = localStorage.getItem('user-language-preference');
          expect(storedValue).not.toBeNull();
          
          const storedPreference = JSON.parse(storedValue!);
          expect(storedPreference.locale).toBe(selectedLocale);
          expect(storedPreference.timestamp).toBeDefined();
          expect(typeof storedPreference.timestamp).toBe('number');
          
          // Unmount the hook to simulate page reload
          const { unmount } = renderHook(() => useLanguage(), { wrapper });
          unmount();
          
          // Create a new hook instance (simulating page reload)
          // The LanguageProvider should read from localStorage on initialization
          const { result: newResult } = renderHook(() => useLanguage(), { wrapper });
          
          // Wait for initialization to complete
          await waitFor(() => {
            // The loaded language should match the saved language
            expect(newResult.current.currentLanguage).toBe(selectedLocale);
          });
          
          // Verify all related properties are consistent
          const expectedIsRTL = selectedLocale === 'ar';
          const expectedDirection = selectedLocale === 'ar' ? 'rtl' : 'ltr';
          
          expect(newResult.current.isRTL).toBe(expectedIsRTL);
          expect(newResult.current.direction).toBe(expectedDirection);
        }
      ),
      {
        // Run at least 100 iterations as specified in the design
        numRuns: 100,
      }
    );
  });

  it('should maintain persistence across multiple save-load cycles', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: array of language selections to test multiple cycles
        fc.array(fc.constantFrom<Locale>('en', 'ar'), { minLength: 2, maxLength: 5 }),
        async (languageSequence) => {
          for (const selectedLocale of languageSequence) {
            // Render hook
            const { result, unmount } = renderHook(() => useLanguage(), { wrapper });
            
            // Change to selected language
            await result.current.changeLanguage(selectedLocale);
            
            // Wait for change to complete
            await waitFor(() => {
              expect(result.current.currentLanguage).toBe(selectedLocale);
            });
            
            // Unmount to simulate page reload
            unmount();
            
            // Create new instance and verify persistence
            const { result: newResult, unmount: newUnmount } = renderHook(() => useLanguage(), { wrapper });
            
            await waitFor(() => {
              expect(newResult.current.currentLanguage).toBe(selectedLocale);
            });
            
            // Clean up
            newUnmount();
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  }, 15000); // Increase timeout for multiple cycles

  it('should handle localStorage unavailability gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (selectedLocale) => {
          // Mock localStorage to throw errors (simulating private mode or blocked access)
          const originalSetItem = Storage.prototype.setItem;
          const originalGetItem = Storage.prototype.getItem;
          
          Storage.prototype.setItem = () => {
            throw new Error('localStorage access denied');
          };
          
          Storage.prototype.getItem = () => {
            throw new Error('localStorage access denied');
          };
          
          try {
            // Render hook
            const { result } = renderHook(() => useLanguage(), { wrapper });
            
            // Change language should still work even if localStorage fails
            await result.current.changeLanguage(selectedLocale);
            
            // Wait for change to complete
            await waitFor(() => {
              expect(result.current.currentLanguage).toBe(selectedLocale);
            });
            
            // Language switching should work, just not persisted
            expect(result.current.currentLanguage).toBe(selectedLocale);
            expect(result.current.isRTL).toBe(selectedLocale === 'ar');
          } finally {
            // Restore original localStorage methods
            Storage.prototype.setItem = originalSetItem;
            Storage.prototype.getItem = originalGetItem;
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should default to English when no preference exists in localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(
        // This test doesn't need a generator, but we use one for consistency
        fc.constant(null),
        async () => {
          // Ensure localStorage is empty
          localStorage.clear();
          
          // Render hook (should initialize with default English)
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Wait for initialization
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe('en');
          });
          
          // Verify default state
          expect(result.current.currentLanguage).toBe('en');
          expect(result.current.isRTL).toBe(false);
          expect(result.current.direction).toBe('ltr');
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should ignore invalid locale values in localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: invalid locale strings
        fc.constantFrom('fr', 'es', 'de', 'invalid', '', '123'),
        async (invalidLocale) => {
          // Store invalid locale in localStorage
          const invalidPreference = {
            locale: invalidLocale,
            timestamp: Date.now(),
          };
          localStorage.setItem('user-language-preference', JSON.stringify(invalidPreference));
          
          // Render hook (should default to English due to invalid locale)
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Wait for initialization
          await waitFor(() => {
            // Should default to English when invalid locale is found
            expect(result.current.currentLanguage).toBe('en');
          });
          
          expect(result.current.currentLanguage).toBe('en');
          expect(result.current.isRTL).toBe(false);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle malformed JSON in localStorage gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: malformed JSON strings
        fc.constantFrom(
          'not json',
          '{invalid}',
          '{"locale":}',
          '',
          'null',
          'undefined'
        ),
        async (malformedJSON) => {
          // Store malformed JSON in localStorage
          localStorage.setItem('user-language-preference', malformedJSON);
          
          // Render hook (should default to English due to parse error)
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Wait for initialization
          await waitFor(() => {
            // Should default to English when JSON parsing fails
            expect(result.current.currentLanguage).toBe('en');
          });
          
          expect(result.current.currentLanguage).toBe('en');
          expect(result.current.isRTL).toBe(false);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should preserve timestamp when saving language preference', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (selectedLocale) => {
          const beforeTimestamp = Date.now();
          
          // Render hook
          const { result } = renderHook(() => useLanguage(), { wrapper });
          
          // Change language
          await result.current.changeLanguage(selectedLocale);
          
          await waitFor(() => {
            expect(result.current.currentLanguage).toBe(selectedLocale);
          });
          
          const afterTimestamp = Date.now();
          
          // Verify timestamp is stored and is reasonable
          const storedValue = localStorage.getItem('user-language-preference');
          expect(storedValue).not.toBeNull();
          
          const storedPreference = JSON.parse(storedValue!);
          expect(storedPreference.timestamp).toBeDefined();
          expect(typeof storedPreference.timestamp).toBe('number');
          
          // Timestamp should be between before and after
          expect(storedPreference.timestamp).toBeGreaterThanOrEqual(beforeTimestamp);
          expect(storedPreference.timestamp).toBeLessThanOrEqual(afterTimestamp);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });
});
