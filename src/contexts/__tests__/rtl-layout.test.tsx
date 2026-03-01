import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import { LanguageProvider, useLanguageContext } from '../LanguageContext';

// Test component to access context
const TestComponent = () => {
  const { currentLanguage, direction, isRTL } = useLanguageContext();
  return (
    <div>
      <span data-testid="language">{currentLanguage}</span>
      <span data-testid="direction">{direction}</span>
      <span data-testid="isRTL">{String(isRTL)}</span>
    </div>
  );
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <LanguageProvider>{children}</LanguageProvider>
  </I18nextProvider>
);

describe('RTL Layout Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    document.documentElement.classList.remove('rtl');
    document.body.classList.remove('font-arabic', 'font-english');
  });

  it('should apply dir="rtl" to document for Arabic locale', async () => {
    localStorage.setItem('user-language-preference', JSON.stringify({ locale: 'ar', timestamp: Date.now() }));
    
    render(<TestComponent />, { wrapper });
    
    await waitFor(() => {
      expect(document.documentElement.dir).toBe('rtl');
    });
  });

  it('should apply dir="ltr" to document for English locale', async () => {
    localStorage.setItem('user-language-preference', JSON.stringify({ locale: 'en', timestamp: Date.now() }));
    
    render(<TestComponent />, { wrapper });
    
    await waitFor(() => {
      expect(document.documentElement.dir).toBe('ltr');
    });
  });

  it('should apply Arabic fonts when Arabic is selected', async () => {
    localStorage.setItem('user-language-preference', JSON.stringify({ locale: 'ar', timestamp: Date.now() }));
    
    render(<TestComponent />, { wrapper });
    
    await waitFor(() => {
      expect(document.body.classList.contains('font-arabic')).toBe(true);
      expect(document.body.classList.contains('font-english')).toBe(false);
    });
  });

  it('should apply English fonts when English is selected', async () => {
    localStorage.setItem('user-language-preference', JSON.stringify({ locale: 'en', timestamp: Date.now() }));
    
    render(<TestComponent />, { wrapper });
    
    await waitFor(() => {
      expect(document.body.classList.contains('font-english')).toBe(true);
      expect(document.body.classList.contains('font-arabic')).toBe(false);
    });
  });
});
