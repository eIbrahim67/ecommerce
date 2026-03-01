import { Locale } from '@/i18n/types';

/**
 * Get localized text based on current language
 * Falls back to English if Arabic text is not available
 * 
 * @param englishText - The English text (always required)
 * @param arabicText - The Arabic text (optional/nullable)
 * @param language - Current language locale
 * @returns The appropriate text based on language preference
 */
export const getLocalizedText = (
  englishText: string,
  arabicText: string | null | undefined,
  language: Locale
): string => {
  // If Arabic is selected and Arabic text exists, use it
  if (language === 'ar' && arabicText) {
    return arabicText;
  }
  
  // Otherwise, fall back to English
  return englishText;
};

/**
 * Get localized badge text with translation fallback
 * 
 * @param badge - Badge type from API
 * @param badgeAr - Arabic badge text from API
 * @param language - Current language locale
 * @returns Localized badge text
 */
export const getLocalizedBadge = (
  badge: string | null | undefined,
  badgeAr: string | null | undefined,
  language: Locale
): string | null => {
  if (!badge) return null;
  
  // If Arabic is selected and Arabic badge exists, use it
  if (language === 'ar' && badgeAr) {
    return badgeAr;
  }
  
  // Fall back to English badge
  return badge;
};
