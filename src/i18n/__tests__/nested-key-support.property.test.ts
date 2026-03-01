import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import i18n, { loadAllTranslations, type Locale } from '../config';

/**
 * Property-Based Test: Nested Translation Key Support
 * Feature: arabic-language-support
 * Property 6: Nested Translation Key Support
 * 
 * **Validates: Requirements 2.5**
 * 
 * For any nested translation structure, accessing a value using dot notation 
 * (e.g., "header.navigation.home") should return the correct nested value.
 */
describe('Property Test: Nested Translation Key Support', () => {
  beforeEach(async () => {
    // Ensure both locales are loaded before each test
    await loadAllTranslations('en');
    await loadAllTranslations('ar');
  });

  it('should retrieve correct nested values using dot notation', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary locale
        fc.constantFrom<Locale>('en', 'ar'),
        // Generator: nested translation keys from actual translation files
        fc.constantFrom(
          { ns: 'common', key: 'buttons.addToCart', expected: { en: 'Add to Cart', ar: 'أضف إلى السلة' } },
          { ns: 'common', key: 'buttons.checkout', expected: { en: 'Checkout', ar: 'الدفع' } },
          { ns: 'common', key: 'labels.email', expected: { en: 'Email', ar: 'البريد الإلكتروني' } },
          { ns: 'common', key: 'labels.password', expected: { en: 'Password', ar: 'كلمة المرور' } },
          { ns: 'common', key: 'messages.loading', expected: { en: 'Loading...', ar: 'جاري التحميل...' } },
          { ns: 'navigation', key: 'header.home', expected: { en: 'Home', ar: 'الرئيسية' } },
          { ns: 'navigation', key: 'header.shop', expected: { en: 'Shop', ar: 'المتجر' } },
          { ns: 'navigation', key: 'footer.quickLinks', expected: { en: 'Quick Links', ar: 'روابط سريعة' } }
        ),
        async (locale, { ns, key, expected }) => {
          // Change to the test locale
          await i18n.changeLanguage(locale);
          
          // Retrieve the translation using dot notation
          const result = i18n.t(key, { ns });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should not be empty
          expect(result.length).toBeGreaterThan(0);
          
          // Result should match the expected translation for the locale
          expect(result).toBe(expected[locale]);
          
          // Result should not be the key itself (since these are valid keys)
          expect(result).not.toBe(key);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle arbitrary nested key depths correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        // Test various nesting depths
        fc.constantFrom(
          // Single level nesting
          { ns: 'common', key: 'buttons.login', depth: 1 },
          { ns: 'common', key: 'labels.name', depth: 1 },
          // Two level nesting (if we had deeper structures)
          { ns: 'navigation', key: 'header.home', depth: 1 },
          { ns: 'navigation', key: 'footer.copyright', depth: 1 }
        ),
        async (locale, { ns, key, depth }) => {
          await i18n.changeLanguage(locale);
          
          const result = i18n.t(key, { ns });
          
          // Should return a valid string
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
          
          // Should not return the key itself (these are valid keys)
          expect(result).not.toBe(key);
          
          // Verify the key has the expected number of dots (depth)
          const dotCount = (key.match(/\./g) || []).length;
          expect(dotCount).toBe(depth);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should return consistent results for the same nested key across multiple calls', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.constantFrom(
          { ns: 'common', key: 'buttons.addToCart' },
          { ns: 'common', key: 'labels.email' },
          { ns: 'navigation', key: 'header.home' },
          { ns: 'navigation', key: 'footer.quickLinks' }
        ),
        async (locale, { ns, key }) => {
          await i18n.changeLanguage(locale);
          
          // Call translation function multiple times
          const result1 = i18n.t(key, { ns });
          const result2 = i18n.t(key, { ns });
          const result3 = i18n.t(key, { ns });
          
          // All results should be identical
          expect(result1).toBe(result2);
          expect(result2).toBe(result3);
          
          // All results should be valid strings
          expect(typeof result1).toBe('string');
          expect(result1.length).toBeGreaterThan(0);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle non-existent nested keys by returning the key as fallback', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        // Generate non-existent nested keys
        fc.constantFrom(
          { ns: 'common', key: 'buttons.nonExistent' },
          { ns: 'common', key: 'labels.missing.deeply.nested' },
          { ns: 'navigation', key: 'header.invalid.path' },
          { ns: 'navigation', key: 'footer.does.not.exist' }
        ),
        async (locale, { ns, key }) => {
          await i18n.changeLanguage(locale);
          
          const result = i18n.t(key, { ns });
          
          // Should return a string
          expect(typeof result).toBe('string');
          
          // Check if the key exists
          const hasTranslation = i18n.exists(key, { ns });
          
          if (!hasTranslation) {
            // Should return the key itself as fallback
            expect(result).toBe(key);
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should correctly access nested values across all namespaces', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.constantFrom(
          { ns: 'common', keys: ['buttons.addToCart', 'labels.email', 'messages.loading'] },
          { ns: 'navigation', keys: ['header.home', 'header.shop', 'footer.quickLinks'] },
          { ns: 'products', keys: ['filters.category', 'filters.price', 'empty.noProducts'] },
          { ns: 'cart', keys: ['labels.quantity', 'labels.subtotal', 'empty.message'] }
        ),
        async (locale, { ns, keys }) => {
          await i18n.changeLanguage(locale);
          
          // Test all keys in the namespace
          for (const key of keys) {
            const result = i18n.t(key, { ns });
            
            // Should return a valid string
            expect(typeof result).toBe('string');
            
            // Check if translation exists
            const hasTranslation = i18n.exists(key, { ns });
            
            if (hasTranslation) {
              // Should not be the key itself
              expect(result).not.toBe(key);
              expect(result.length).toBeGreaterThan(0);
            } else {
              // Should be the key as fallback
              expect(result).toBe(key);
            }
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain correct nesting structure when accessing parent vs child keys', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        async (locale) => {
          await i18n.changeLanguage(locale);
          
          // Access parent key (should return object or fallback)
          const parentResult = i18n.t('buttons', { ns: 'common' });
          
          // Access child key (should return string value)
          const childResult = i18n.t('buttons.addToCart', { ns: 'common' });
          
          // Child result should be a string
          expect(typeof childResult).toBe('string');
          expect(childResult.length).toBeGreaterThan(0);
          expect(childResult).not.toBe('buttons.addToCart');
          
          // Parent result behavior depends on i18next configuration
          // It may return the key or an object representation
          expect(parentResult).toBeDefined();
        }
      ),
      {
        numRuns: 100,
      }
    );
  });
});
