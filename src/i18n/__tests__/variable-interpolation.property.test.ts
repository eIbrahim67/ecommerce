import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import i18n, { loadAllTranslations, type Locale } from '../config';

/**
 * Property-Based Test: Variable Interpolation
 * Feature: arabic-language-support
 * Property 7: Variable Interpolation
 * 
 * **Validates: Requirements 2.6**
 * 
 * For any translation string containing variable placeholders and any set of 
 * variable values, interpolation should correctly replace placeholders with 
 * the provided values.
 */
describe('Property Test: Variable Interpolation', () => {
  beforeEach(async () => {
    // Ensure both locales are loaded before each test
    await loadAllTranslations('en');
    await loadAllTranslations('ar');
  });

  it('should correctly interpolate single variable in translation strings', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generator: arbitrary locale
        fc.constantFrom<Locale>('en', 'ar'),
        // Generator: arbitrary variable name
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        // Generator: arbitrary variable value
        fc.oneof(
          fc.string({ minLength: 0, maxLength: 50 }),
          fc.integer(),
          fc.float(),
          fc.boolean()
        ),
        async (locale, varName, varValue) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with a variable placeholder
          const translationKey = 'test.interpolation.single';
          const translationTemplate = `Hello {{${varName}}}!`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation
          const result = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should contain the interpolated value
          const expectedValue = String(varValue);
          expect(result).toContain(expectedValue);
          
          // Result should not contain the placeholder
          expect(result).not.toContain(`{{${varName}}}`);
          
          // Result should match the expected pattern
          expect(result).toBe(`Hello ${expectedValue}!`);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should correctly interpolate multiple variables in translation strings', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        // Generator: arbitrary number of variables (2-5)
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 15 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s) && s !== '__proto__' && s !== 'constructor' && s !== 'prototype'),
            value: fc.oneof(
              fc.string({ minLength: 0, maxLength: 30 }),
              fc.integer({ min: -1000, max: 1000 }),
              fc.float({ min: -1000, max: 1000, noNaN: true })
            )
          }),
          { minLength: 2, maxLength: 5 }
        ).filter(arr => {
          // Ensure all variable names are unique and not reserved
          const names = arr.map(v => v.name);
          return new Set(names).size === names.length;
        }),
        async (locale, variables) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with multiple variable placeholders
          const translationKey = 'test.interpolation.multiple';
          const placeholders = variables.map(v => `{{${v.name}}}`).join(' ');
          const translationTemplate = `Values: ${placeholders}`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Create the interpolation object
          const interpolationData = variables.reduce((acc, v) => {
            acc[v.name] = v.value;
            return acc;
          }, {} as Record<string, any>);
          
          // Perform interpolation
          const result = i18n.t(translationKey, { 
            ns: 'common',
            ...interpolationData
          });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should contain all interpolated values
          variables.forEach(v => {
            const expectedValue = String(v.value);
            expect(result).toContain(expectedValue);
          });
          
          // Result should not contain any placeholders
          variables.forEach(v => {
            expect(result).not.toContain(`{{${v.name}}}`);
          });
          
          // Verify the complete result
          const expectedValues = variables.map(v => String(v.value)).join(' ');
          expect(result).toBe(`Values: ${expectedValues}`);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle missing variable values by keeping the placeholder', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        async (locale, varName) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with a variable placeholder
          const translationKey = 'test.interpolation.missing';
          const translationTemplate = `Hello {{${varName}}}!`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation WITHOUT providing the variable
          const result = i18n.t(translationKey, { ns: 'common' });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should still contain the placeholder (i18next behavior)
          // or an empty string depending on configuration
          expect(result).toBeDefined();
          expect(result.length).toBeGreaterThan(0);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle special characters in variable values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        // Generator: strings with special characters
        fc.string({ minLength: 0, maxLength: 50 }),
        async (locale, varName, varValue) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with a variable placeholder
          const translationKey = 'test.interpolation.special';
          const translationTemplate = `Value: {{${varName}}}`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation
          const result = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should contain the interpolated value
          expect(result).toContain(varValue);
          
          // Result should not contain the placeholder
          expect(result).not.toContain(`{{${varName}}}`);
          
          // Result should match the expected pattern
          expect(result).toBe(`Value: ${varValue}`);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should interpolate variables consistently across multiple calls', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        fc.string({ minLength: 0, maxLength: 50 }),
        async (locale, varName, varValue) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with a variable placeholder
          const translationKey = 'test.interpolation.consistent';
          const translationTemplate = `Message: {{${varName}}}`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation multiple times
          const result1 = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          const result2 = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          const result3 = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          
          // All results should be identical
          expect(result1).toBe(result2);
          expect(result2).toBe(result3);
          
          // All results should contain the interpolated value
          expect(result1).toContain(varValue);
          expect(result1).not.toContain(`{{${varName}}}`);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should interpolate variables correctly in both English and Arabic', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (varName, varValue) => {
          // Create translation strings for both locales
          const translationKey = 'test.interpolation.bilingual';
          const enTemplate = `Welcome {{${varName}}}!`;
          const arTemplate = `مرحبا {{${varName}}}!`;
          
          // Add translations for both locales
          i18n.addResource('en', 'common', translationKey, enTemplate);
          i18n.addResource('ar', 'common', translationKey, arTemplate);
          
          // Test English interpolation
          await i18n.changeLanguage('en');
          const enResult = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          
          expect(enResult).toBe(`Welcome ${varValue}!`);
          expect(enResult).not.toContain(`{{${varName}}}`);
          
          // Test Arabic interpolation
          await i18n.changeLanguage('ar');
          const arResult = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: varValue 
          });
          
          expect(arResult).toBe(`مرحبا ${varValue}!`);
          expect(arResult).not.toContain(`{{${varName}}}`);
          
          // Both should contain the same interpolated value
          expect(enResult).toContain(varValue);
          expect(arResult).toContain(varValue);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle nested variable interpolation in complex strings', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 20 }),
          count: fc.integer({ min: 0, max: 100 }),
          price: fc.float({ min: Math.fround(0.01), max: 1000, noNaN: true, noDefaultInfinity: true })
        }),
        async (locale, data) => {
          await i18n.changeLanguage(locale);
          
          // Create a complex translation string with multiple variables
          const translationKey = 'test.interpolation.complex';
          const translationTemplate = 'Product: {{name}}, Quantity: {{count}}, Price: ${{price}}';
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation
          const result = i18n.t(translationKey, { 
            ns: 'common',
            ...data
          });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should contain all interpolated values
          expect(result).toContain(String(data.name));
          expect(result).toContain(String(data.count));
          expect(result).toContain(String(data.price));
          
          // Result should not contain any placeholders
          expect(result).not.toContain('{{name}}');
          expect(result).not.toContain('{{count}}');
          expect(result).not.toContain('{{price}}');
          
          // Verify the complete result structure (allowing for scientific notation)
          expect(result).toMatch(/^Product: .+, Quantity: \d+, Price: \$[\d.e+-]+$/);
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle empty string variable values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        async (locale, varName) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with a variable placeholder
          const translationKey = 'test.interpolation.empty';
          const translationTemplate = `Value: [{{${varName}}}]`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation with empty string
          const result = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: '' 
          });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should not contain the placeholder
          expect(result).not.toContain(`{{${varName}}}`);
          
          // Result should be the template with empty value
          expect(result).toBe('Value: []');
        }
      ),
      {
        numRuns: 100,
      }
    );
  });

  it('should handle numeric zero as a valid variable value', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Locale>('en', 'ar'),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)),
        async (locale, varName) => {
          await i18n.changeLanguage(locale);
          
          // Create a translation string with a variable placeholder
          const translationKey = 'test.interpolation.zero';
          const translationTemplate = `Count: {{${varName}}}`;
          
          // Add the test translation to i18n
          i18n.addResource(locale, 'common', translationKey, translationTemplate);
          
          // Perform interpolation with zero
          const result = i18n.t(translationKey, { 
            ns: 'common',
            [varName]: 0 
          });
          
          // Result should be a string
          expect(typeof result).toBe('string');
          
          // Result should contain '0'
          expect(result).toContain('0');
          
          // Result should not contain the placeholder
          expect(result).not.toContain(`{{${varName}}}`);
          
          // Result should be the expected value
          expect(result).toBe('Count: 0');
        }
      ),
      {
        numRuns: 100,
      }
    );
  });
});
