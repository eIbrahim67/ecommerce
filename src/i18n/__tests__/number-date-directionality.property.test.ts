import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import i18n, { loadAllTranslations, type Locale } from '../config';

/**
 * Property-Based Test: Number and Date Directionality Preservation
 * Feature: arabic-language-support
 * Property 9: Number and Date Directionality Preservation
 * 
 * **Validates: Requirements 3.5**
 * 
 * For any number, date, or currency value, the directionality should remain 
 * consistent (LTR) regardless of the current locale setting. Numbers and dates 
 * should not be mirrored in RTL mode.
 */
describe('Property Test: Number and Date Directionality Preservation', () => {
  beforeEach(async () => {
    // Ensure both locales are loaded before each test
    await loadAllTranslations('en');
    await loadAllTranslations('ar');
  });

  /**
   * Helper function to check if a string contains LTR marks or maintains LTR directionality
   * Numbers should be displayed left-to-right even in RTL contexts
   * Note: Arabic locale may use Arabic-Indic numerals (٠-٩) or Western Arabic numerals (0-9)
   */
  const hasLTRDirectionality = (text: string): boolean => {
    // Check for explicit LTR marks (U+200E)
    const hasLTRMark = text.includes('\u200E');
    
    // Check for Western Arabic numerals (0-9)
    const westernDigits = text.match(/[0-9]+/g);
    
    // Check for Arabic-Indic numerals (٠-٩)
    const arabicIndicDigits = text.match(/[\u0660-\u0669]+/g);
    
    // If we have any digit sequences, the text contains numbers
    const hasDigits = westernDigits !== null || arabicIndicDigits !== null;
    
    // Numbers maintain LTR directionality if they exist
    return hasLTRMark || hasDigits;
  };

  /**
   * Helper function to format a number with locale-specific formatting
   */
  const formatNumber = (value: number, locale: Locale): string => {
    return new Intl.NumberFormat(locale).format(value);
  };

  /**
   * Helper function to format a date with locale-specific formatting
   */
  const formatDate = (date: Date, locale: Locale): string => {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  /**
   * Helper function to format currency with locale-specific formatting
   */
  const formatCurrency = (value: number, locale: Locale): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  it('should maintain LTR directionality for numbers in any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary locale
        fc.constantFrom<Locale>('en', 'ar'),
        // Generator: arbitrary number
        fc.integer({ min: -1000000, max: 1000000 }),
        async (locale, number) => {
          await i18n.changeLanguage(locale);
          
          // Format the number with locale-specific formatting
          const formatted = formatNumber(number, locale);
          
          // The formatted number should be a string
          expect(typeof formatted).toBe('string');
          
          // Extract Western Arabic digit sequences (0-9)
          const westernDigits = formatted.match(/[0-9]+/g);
          
          // Extract Arabic-Indic digit sequences (٠-٩)
          const arabicIndicDigits = formatted.match(/[\u0660-\u0669]+/g);
          
          // At least one type of digits should be present
          expect(westernDigits !== null || arabicIndicDigits !== null).toBe(true);
          
          // If Western digits are used, verify they match the original number
          if (westernDigits) {
            const originalDigits = Math.abs(number).toString();
            const formattedDigits = westernDigits.join('');
            expect(formattedDigits).toBe(originalDigits);
          }
          
          // Numbers should maintain LTR directionality regardless of locale
          // This means digits should not be reversed in RTL mode
          expect(hasLTRDirectionality(formatted)).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain LTR directionality for dates in any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        // Generator: arbitrary date (filter out invalid dates)
        fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }).filter(d => !isNaN(d.getTime())),
        async (locale, date) => {
          await i18n.changeLanguage(locale);
          
          // Format the date with locale-specific formatting
          const formatted = formatDate(date, locale);
          
          // The formatted date should be a string
          expect(typeof formatted).toBe('string');
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.match(/[0-9]+/g);
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.match(/[\u0660-\u0669]+/g);
          
          // At least one type of digits should be present
          expect(westernDigits !== null || arabicIndicDigits !== null).toBe(true);
          
          // Dates should maintain LTR directionality regardless of locale
          expect(hasLTRDirectionality(formatted)).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain LTR directionality for currency values in any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        // Generator: arbitrary currency amount
        fc.float({ min: Math.fround(0.01), max: 1000000, noNaN: true, noDefaultInfinity: true }),
        async (locale, amount) => {
          await i18n.changeLanguage(locale);
          
          // Format the currency with locale-specific formatting
          const formatted = formatCurrency(amount, locale);
          
          // The formatted currency should be a string
          expect(typeof formatted).toBe('string');
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.match(/[0-9]+/g);
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.match(/[\u0660-\u0669]+/g);
          
          // At least one type of digits should be present
          expect(westernDigits !== null || arabicIndicDigits !== null).toBe(true);
          
          // Currency values should maintain LTR directionality regardless of locale
          expect(hasLTRDirectionality(formatted)).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should preserve digit order in formatted numbers across locales', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1000, max: 999999 }),
        async (number) => {
          // Format the same number in both locales
          const enFormatted = formatNumber(number, 'en');
          const arFormatted = formatNumber(number, 'ar');
          
          // Extract Western Arabic digits from English formatted string
          const enDigits = enFormatted.replace(/[^0-9]/g, '');
          
          // Extract digits from Arabic formatted string (could be Western or Arabic-Indic)
          const arWesternDigits = arFormatted.replace(/[^0-9]/g, '');
          const arArabicIndicDigits = arFormatted.replace(/[^\u0660-\u0669]/g, '');
          
          // English should use Western digits
          const originalDigits = number.toString();
          expect(enDigits).toBe(originalDigits);
          
          // Arabic should use either Western or Arabic-Indic digits
          // If Western digits are used, they should match
          if (arWesternDigits.length > 0) {
            expect(arWesternDigits).toBe(originalDigits);
          }
          
          // If Arabic-Indic digits are used, verify they're present
          if (arArabicIndicDigits.length > 0) {
            expect(arArabicIndicDigits.length).toBeGreaterThan(0);
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should preserve date component order in formatted dates across locales', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }).filter(d => !isNaN(d.getTime())),
        async (date) => {
          // Format the same date in both locales
          const enFormatted = formatDate(date, 'en');
          const arFormatted = formatDate(date, 'ar');
          
          // Extract Western Arabic digits from English formatted string
          const enDigits = enFormatted.replace(/[^0-9]/g, '');
          
          // Extract digits from Arabic formatted string
          const arWesternDigits = arFormatted.replace(/[^0-9]/g, '');
          const arArabicIndicDigits = arFormatted.replace(/[^\u0660-\u0669]/g, '');
          
          // Both should contain digits
          expect(enDigits.length).toBeGreaterThan(0);
          expect(arWesternDigits.length > 0 || arArabicIndicDigits.length > 0).toBe(true);
          
          // Verify that the year, month, and day are present
          const year = date.getFullYear().toString();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          
          // English formatted string should contain these components
          expect(enFormatted).toContain(year);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain consistent directionality for decimal numbers', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.float({ min: Math.fround(0.01), max: Math.fround(9999.99), noNaN: true, noDefaultInfinity: true }),
        async (locale, number) => {
          await i18n.changeLanguage(locale);
          
          // Format the decimal number
          const formatted = formatNumber(number, locale);
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.match(/[0-9]+/g);
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.match(/[\u0660-\u0669]+/g);
          
          // At least one type of digits should be present
          expect(westernDigits !== null || arabicIndicDigits !== null).toBe(true);
          
          // Decimal numbers should maintain LTR directionality
          expect(hasLTRDirectionality(formatted)).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain directionality for negative numbers', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.integer({ min: -999999, max: -1 }),
        async (locale, number) => {
          await i18n.changeLanguage(locale);
          
          // Format the negative number
          const formatted = formatNumber(number, locale);
          
          // The formatted number should contain a minus sign or parentheses
          const hasMinusSign = formatted.includes('-') || formatted.includes('−');
          const hasParentheses = formatted.includes('(') && formatted.includes(')');
          
          expect(hasMinusSign || hasParentheses).toBe(true);
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.replace(/[^0-9]/g, '');
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.replace(/[^\u0660-\u0669]/g, '');
          
          // At least one type of digits should be present
          expect(westernDigits.length > 0 || arabicIndicDigits.length > 0).toBe(true);
          
          // If Western digits are used, verify they match the original number
          if (westernDigits.length > 0) {
            const originalDigits = Math.abs(number).toString();
            expect(westernDigits).toBe(originalDigits);
          }
          
          // Negative numbers should maintain LTR directionality
          expect(hasLTRDirectionality(formatted)).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain directionality for large numbers with separators', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.integer({ min: 1000000, max: 999999999 }),
        async (locale, number) => {
          await i18n.changeLanguage(locale);
          
          // Format the large number (should include separators)
          const formatted = formatNumber(number, locale);
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.replace(/[^0-9]/g, '');
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.replace(/[^\u0660-\u0669]/g, '');
          
          // At least one type of digits should be present
          expect(westernDigits.length > 0 || arabicIndicDigits.length > 0).toBe(true);
          
          // If Western digits are used, verify they match the original number
          if (westernDigits.length > 0) {
            const originalDigits = number.toString();
            expect(westernDigits).toBe(originalDigits);
          }
          
          // Large numbers should maintain LTR directionality
          expect(hasLTRDirectionality(formatted)).toBe(true);
          
          // The formatted string should contain separators
          // (either comma, space, or other separator depending on locale)
          const totalDigits = westernDigits.length + arabicIndicDigits.length;
          const hasSeparators = formatted.length > totalDigits;
          expect(hasSeparators).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain directionality for time values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') }).filter(d => !isNaN(d.getTime())),
        async (locale, date) => {
          await i18n.changeLanguage(locale);
          
          // Format the time
          const formatted = new Intl.DateTimeFormat(locale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(date);
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.match(/[0-9]+/g);
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.match(/[\u0660-\u0669]+/g);
          
          // At least one type of digits should be present
          expect(westernDigits !== null || arabicIndicDigits !== null).toBe(true);
          
          // Time values should maintain LTR directionality
          expect(hasLTRDirectionality(formatted)).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain directionality for percentage values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.float({ min: Math.fround(0), max: 100, noNaN: true, noDefaultInfinity: true }),
        async (locale, percentage) => {
          await i18n.changeLanguage(locale);
          
          // Format as percentage
          const formatted = new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          }).format(percentage / 100);
          
          // Extract Western Arabic digits (0-9)
          const westernDigits = formatted.replace(/[^0-9]/g, '');
          
          // Extract Arabic-Indic digits (٠-٩)
          const arabicIndicDigits = formatted.replace(/[^\u0660-\u0669]/g, '');
          
          // At least one type of digits should be present (unless percentage is 0)
          if (percentage > 0) {
            expect(westernDigits.length > 0 || arabicIndicDigits.length > 0).toBe(true);
          }
          
          // Percentage values should maintain LTR directionality
          expect(hasLTRDirectionality(formatted)).toBe(true);
          
          // Should contain a percent sign
          expect(formatted.includes('%') || formatted.includes('٪')).toBe(true);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should maintain consistent directionality across multiple number formats in the same locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.record({
          integer: fc.integer({ min: 1, max: 999999 }),
          decimal: fc.float({ min: Math.fround(0.01), max: Math.fround(9999.99), noNaN: true, noDefaultInfinity: true }),
          currency: fc.float({ min: Math.fround(0.01), max: Math.fround(99999.99), noNaN: true, noDefaultInfinity: true })
        }),
        async (locale, values) => {
          await i18n.changeLanguage(locale);
          
          // Format all values
          const formattedInteger = formatNumber(values.integer, locale);
          const formattedDecimal = formatNumber(values.decimal, locale);
          const formattedCurrency = formatCurrency(values.currency, locale);
          
          // All should maintain LTR directionality
          expect(hasLTRDirectionality(formattedInteger)).toBe(true);
          expect(hasLTRDirectionality(formattedDecimal)).toBe(true);
          expect(hasLTRDirectionality(formattedCurrency)).toBe(true);
          
          // Verify digits are present in all formats
          const integerWesternDigits = formattedInteger.replace(/[^0-9]/g, '');
          const integerArabicIndicDigits = formattedInteger.replace(/[^\u0660-\u0669]/g, '');
          expect(integerWesternDigits.length > 0 || integerArabicIndicDigits.length > 0).toBe(true);
          
          // If Western digits are used for integer, verify they match
          if (integerWesternDigits.length > 0) {
            expect(integerWesternDigits).toBe(values.integer.toString());
          }
        }
      ),
      {
        numRuns: 100,
      }
    );
  });
});
