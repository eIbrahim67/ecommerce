import { describe, it, expect, beforeAll } from 'vitest';
import i18n, { loadAllTranslations } from '../config';

/**
 * Translation Coverage Tests
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 6.4**
 * 
 * These tests verify that all UI elements have proper translations
 * in both English and Arabic across all translation namespaces.
 */
describe('Translation Coverage', () => {
  beforeAll(async () => {
    // Ensure all translations are loaded for both languages
    await loadAllTranslations('en');
    await loadAllTranslations('ar');
  });

  describe('Navigation Menu Items', () => {
    const navigationKeys = [
      'navigation:header.home',
      'navigation:header.shop',
      'navigation:header.about',
      'navigation:header.contact',
      'navigation:header.cart',
      'navigation:header.wishlist',
      'navigation:header.account',
    ];

    it('should have English translations for all navigation menu items', () => {
      i18n.changeLanguage('en');
      
      navigationKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('header.');
      });
    });

    it('should have Arabic translations for all navigation menu items', async () => {
      await i18n.changeLanguage('ar');
      
      navigationKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('header.');
      });
      
      // Reset to English
      await i18n.changeLanguage('en');
    });
  });

  describe('Button Labels', () => {
    const buttonKeys = [
      'common:buttons.addToCart',
      'common:buttons.checkout',
      'common:buttons.login',
      'common:buttons.register',
      'common:buttons.submit',
      'common:buttons.cancel',
      'common:buttons.save',
      'common:buttons.delete',
      'common:buttons.edit',
      'common:buttons.search',
    ];

    it('should have English translations for all button labels', () => {
      i18n.changeLanguage('en');
      
      buttonKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('buttons.');
      });
    });

    it('should have Arabic translations for all button labels', async () => {
      await i18n.changeLanguage('ar');
      
      buttonKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('buttons.');
      });
      
      // Reset to English
      await i18n.changeLanguage('en');
    });
  });

  describe('Form Labels', () => {
    const formLabelKeys = [
      'common:labels.email',
      'common:labels.password',
      'common:labels.name',
      'common:labels.phone',
      'common:labels.address',
    ];

    it('should have English translations for all form labels', () => {
      i18n.changeLanguage('en');
      
      formLabelKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('labels.');
      });
    });

    it('should have Arabic translations for all form labels', async () => {
      await i18n.changeLanguage('ar');
      
      formLabelKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('labels.');
      });
      
      // Reset to English
      await i18n.changeLanguage('en');
    });
  });

  describe('Validation Error Messages', () => {
    const errorKeys = [
      'errors:validation.required',
      'errors:validation.invalidEmail',
    ];

    it('should have English translations for all validation error messages', () => {
      i18n.changeLanguage('en');
      
      errorKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('validation.');
      });
    });

    it('should have Arabic translations for all validation error messages', async () => {
      await i18n.changeLanguage('ar');
      
      errorKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('validation.');
      });
      
      // Reset to English
      await i18n.changeLanguage('en');
    });
  });

  describe('Empty State Messages', () => {
    const emptyStateKeys = [
      'common:messages.noResults',
      'products:messages.noProducts',
    ];

    it('should have English translations for all empty state messages', () => {
      i18n.changeLanguage('en');
      
      emptyStateKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('messages.');
      });
    });

    it('should have Arabic translations for all empty state messages', async () => {
      await i18n.changeLanguage('ar');
      
      emptyStateKeys.forEach(key => {
        const translation = i18n.t(key);
        expect(translation).toBeTruthy();
        expect(translation).not.toBe(key);
        expect(translation).not.toContain('messages.');
      });
      
      // Reset to English
      await i18n.changeLanguage('en');
    });
  });

  describe('Translation Completeness', () => {
    it('should have matching translation keys between English and Arabic', async () => {
      // Get all English translations
      await i18n.changeLanguage('en');
      const enStore = i18n.store.data.en;
      
      // Get all Arabic translations
      await i18n.changeLanguage('ar');
      const arStore = i18n.store.data.ar;
      
      // Check that both languages have the same namespaces
      const enNamespaces = Object.keys(enStore);
      const arNamespaces = Object.keys(arStore);
      
      expect(arNamespaces).toEqual(expect.arrayContaining(enNamespaces));
      expect(enNamespaces).toEqual(expect.arrayContaining(arNamespaces));
      
      // Reset to English
      await i18n.changeLanguage('en');
    });
  });
});
