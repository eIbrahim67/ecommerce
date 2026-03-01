import { describe, it, expect, beforeAll } from 'vitest';
import i18n, { loadAllTranslations, namespaces } from '../config';

describe('i18n Configuration', () => {
  beforeAll(async () => {
    // Ensure translations are loaded
    await loadAllTranslations('en');
    await loadAllTranslations('ar');
  });

  it('should initialize i18n with correct default language', () => {
    expect(i18n.language).toBe('en');
  });

  it('should have correct fallback language', () => {
    expect(i18n.options.fallbackLng).toEqual(['en']);
  });

  it('should support English and Arabic languages', () => {
    expect(i18n.options.supportedLngs).toContain('en');
    expect(i18n.options.supportedLngs).toContain('ar');
  });

  it('should have all required namespaces configured', () => {
    const expectedNamespaces = [
      'common',
      'navigation',
      'products',
      'cart',
      'checkout',
      'auth',
      'admin',
      'errors',
    ];
    
    expectedNamespaces.forEach(ns => {
      expect(namespaces).toContain(ns);
    });
  });

  it('should have common as default namespace', () => {
    expect(i18n.options.defaultNS).toBe('common');
  });

  it('should load English translations successfully', async () => {
    const translation = i18n.t('common:buttons.login');
    expect(translation).toBe('Login');
  });

  it('should load Arabic translations successfully', async () => {
    await i18n.changeLanguage('ar');
    const translation = i18n.t('common:buttons.login');
    expect(translation).toBe('تسجيل الدخول');
    
    // Reset to English
    await i18n.changeLanguage('en');
  });

  it('should return key as fallback for missing translations', () => {
    const translation = i18n.t('common:nonexistent.key');
    // i18next returns just the key part without namespace prefix
    expect(translation).toBe('nonexistent.key');
  });

  it('should support nested translation keys', () => {
    const translation = i18n.t('navigation:header.home');
    expect(translation).toBe('Home');
  });

  it('should support variable interpolation', () => {
    // Add a translation with variable for testing
    i18n.addResource('en', 'common', 'greeting', 'Hello, {{name}}!');
    const translation = i18n.t('common:greeting', { name: 'John' });
    expect(translation).toBe('Hello, John!');
  });
});
