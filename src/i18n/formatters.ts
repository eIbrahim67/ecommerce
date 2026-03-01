import { Locale } from './types';

/**
 * Format a date according to the specified locale
 */
export const formatDate = (
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Date formatting error:', error);
    return String(date);
  }
};

/**
 * Format a number according to the specified locale
 */
export const formatNumber = (
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string => {
  try {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid number');
    }

    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', options).format(value);
  } catch (error) {
    console.error('Number formatting error:', error);
    return String(value);
  }
};

/**
 * Format a currency value according to the specified locale
 */
export const formatCurrency = (
  value: number,
  locale: Locale,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  try {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid number');
    }

    const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency,
      ...options,
    };

    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', defaultOptions).format(value);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${value}`;
  }
};
