import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/config';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <LanguageProvider>{children}</LanguageProvider>
  </I18nextProvider>
);

describe('LanguageSwitcher', () => {
  it('should render with current language', () => {
    render(<LanguageSwitcher />, { wrapper });
    
    // Should show Arabic text when in English mode (to switch to Arabic)
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  it('should toggle language when clicked', async () => {
    render(<LanguageSwitcher />, { wrapper });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      // After clicking, should show English text (to switch back to English)
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  it('should have proper aria-label', () => {
    render(<LanguageSwitcher />, { wrapper });
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('should display globe icon', () => {
    render(<LanguageSwitcher />, { wrapper });
    
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});
