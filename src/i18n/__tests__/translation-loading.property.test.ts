import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import i18n, { loadAllTranslations, namespaces, type Locale } from '../config';

/**
 * Property-Based Test: Translation File Loading
 * Feature: arabic-language-support
 * Property 3: Translation File Loading
 * 
 * **Validates: Requirements 2.1**
 * 
 * For any supported locale (English or Arabic), the i18n system should 
 * successfully load the corresponding translation files without errors.
 */
describe('Property Test: Translation File Loading', () => {
  it('should successfully load translation files for any supported locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary locale from supported locales
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          // Attempt to load all translations for the locale
          await loadAllTranslations(locale);
          
          // Change i18n to the locale to verify it's properly loaded
          await i18n.changeLanguage(locale);
          
          // Verify i18n is initialized and ready
          expect(i18n.isInitialized).toBe(true);
          
          // Verify the language was changed successfully
          expect(i18n.language).toBe(locale);
          
          // Verify all namespaces are loaded for this locale
          namespaces.forEach(namespace => {
            const hasNamespace = i18n.hasResourceBundle(locale, namespace);
            expect(hasNamespace).toBe(true);
          });
          
          // Verify we can retrieve at least one translation from each namespace
          // This ensures the files are not just loaded but contain valid data
          namespaces.forEach(namespace => {
            const store = i18n.getResourceBundle(locale, namespace);
            expect(store).toBeDefined();
            expect(typeof store).toBe('object');
            expect(Object.keys(store).length).toBeGreaterThan(0);
          });
        }
      ),
      {
        // Run at least 100 iterations as specified in the design
        numRuns: 100,
      }
    );
  });

  it('should load translations without throwing errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          // This should not throw any errors
          await expect(loadAllTranslations(locale)).resolves.not.toThrow();
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain i18n initialization state after loading any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          await loadAllTranslations(locale);
          
          // i18n should remain initialized
          expect(i18n.isInitialized).toBe(true);
          
          // i18n should have the correct options
          expect(i18n.options.fallbackLng).toEqual(['en']);
          expect(i18n.options.supportedLngs).toContain(locale);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });
});
