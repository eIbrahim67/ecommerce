import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define supported locales
export type Locale = 'en' | 'ar';

// Define namespaces
export const namespaces = [
  'common',
  'navigation',
  'products',
  'cart',
  'checkout',
  'auth',
  'admin',
  'errors',
  'home',
  'about',
  'contact',
  'orders',
  'account',
  'wishlist',
] as const;

export type Namespace = typeof namespaces[number];

// i18next configuration
i18n
  .use(initReactI18next)
  .init({
    // Default language
    lng: 'ar',
    
    // Fallback language
    fallbackLng: 'ar',
    
    // Supported languages
    supportedLngs: ['en', 'ar'],
    
    // Namespaces
    ns: namespaces,
    defaultNS: 'common',
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React-specific options
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
    
    // Debug mode (disable in production)
    debug: import.meta.env.DEV,
    
    // Return key if translation is missing
    returnNull: false,
    returnEmptyString: false,
    
    // Load translations lazily
    partialBundledLanguages: true,
    
    // Resources will be loaded dynamically
    resources: {},
  });

// Function to load translations for a specific locale and namespace
export const loadTranslations = async (locale: Locale, namespace: Namespace) => {
  try {
    const translations = await import(`./locales/${locale}/${namespace}.json`);
    i18n.addResourceBundle(locale, namespace, translations.default, true, true);
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}:`, error);
  }
};

// Function to load all translations for a locale
export const loadAllTranslations = async (locale: Locale) => {
  const promises = namespaces.map(namespace => loadTranslations(locale, namespace));
  await Promise.all(promises);
};

// Initialize with Arabic translations
loadAllTranslations('ar').catch(console.error);

export default i18n;
