import { TFunction } from 'i18next';

/**
 * Supported locale codes
 */
export type Locale = 'en' | 'ar';

/**
 * Translation namespaces
 */
export type Namespace = 
  | 'common'
  | 'navigation'
  | 'products'
  | 'cart'
  | 'checkout'
  | 'auth'
  | 'admin'
  | 'errors';

/**
 * Text direction for layout
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Configuration for a specific locale
 */
export interface LocaleConfig {
  /** Locale code (e.g., 'en', 'ar') */
  code: Locale;
  /** English name of the language */
  name: string;
  /** Native name of the language */
  nativeName: string;
  /** Text direction for this locale */
  direction: Direction;
  /** Date format pattern */
  dateFormat: string;
  /** Number formatting options */
  numberFormat: Intl.NumberFormatOptions;
  /** Currency formatting options */
  currencyFormat: Intl.NumberFormatOptions;
}

/**
 * Translation key structure for nested translations
 * Supports dot notation (e.g., "header.navigation.home")
 */
export type TranslationKey = string;

/**
 * Translation value can be a string or nested object
 */
export type TranslationValue = string | TranslationObject;

/**
 * Translation object with nested structure
 */
export interface TranslationObject {
  [key: string]: TranslationValue;
}

/**
 * Translation namespace structure
 */
export interface TranslationNamespace {
  [key: string]: TranslationValue;
}

/**
 * Translation resources for all locales and namespaces
 */
export interface TranslationResources {
  [locale: string]: {
    [namespace: string]: TranslationNamespace;
  };
}

/**
 * Options for variable interpolation in translations
 */
export interface InterpolationOptions {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Type-safe translation function
 * Supports nested keys with dot notation and variable interpolation
 */
export type TranslationFunction = (
  key: TranslationKey,
  options?: InterpolationOptions
) => string;

/**
 * Extended translation function from i18next with namespace support
 */
export type I18nTranslationFunction = TFunction<Namespace, undefined>;

/**
 * Language preference stored in localStorage
 */
export interface LanguagePreference {
  /** Selected locale */
  locale: Locale;
  /** Timestamp when preference was saved */
  timestamp: number;
}

/**
 * Product translations for multi-language support
 */
export interface ProductTranslations {
  en: ProductTranslationContent;
  ar: ProductTranslationContent;
}

/**
 * Product translation content for a specific locale
 */
export interface ProductTranslationContent {
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product category */
  category: string;
  /** Optional product attributes */
  attributes?: Record<string, string>;
}

/**
 * Date formatting options
 */
export interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  locale?: Locale;
}

/**
 * Number formatting options
 */
export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  locale?: Locale;
}

/**
 * Currency formatting options
 */
export interface CurrencyFormatOptions extends Intl.NumberFormatOptions {
  locale?: Locale;
  currency?: string;
}

/**
 * Locale configurations for all supported languages
 */
export const localeConfigs: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'USD' },
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { useGrouping: true },
    currencyFormat: { style: 'currency', currency: 'USD' },
  },
};

/**
 * Helper type to get direction from locale
 */
export const getDirection = (locale: Locale): Direction => {
  return localeConfigs[locale].direction;
};

/**
 * Helper type to check if locale is RTL
 */
export const isRTL = (locale: Locale): boolean => {
  return localeConfigs[locale].direction === 'rtl';
};
