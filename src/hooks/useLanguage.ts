import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '../contexts/LanguageContext';

/**
 * Custom hook that combines language context and i18next translation
 */
export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  const languageContext = useLanguageContext();

  return {
    ...languageContext,
    t,
    i18n,
  };
};
