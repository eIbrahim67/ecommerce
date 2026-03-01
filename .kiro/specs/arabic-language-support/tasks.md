# Implementation Plan: Arabic Language Support

## Overview

This implementation plan breaks down the Arabic language support feature into discrete, actionable coding tasks. The approach follows a bottom-up strategy: first establishing the i18n infrastructure, then building the language management system, followed by creating translation files, implementing RTL support, and finally integrating with existing components. Each task builds incrementally on previous work, with checkpoints to validate functionality.

## Tasks

- [ ] 1. Set up i18n infrastructure and configuration
  - [x] 1.1 Install dependencies and configure i18next
    - Install react-i18next, i18next packages
    - Create `src/i18n/config.ts` with i18next configuration
    - Configure language detection, fallback language, and namespaces
    - Set up resource loading for lazy-loaded translations
    - _Requirements: 2.1, 2.2_
  
  - [x] 1.2 Create TypeScript types for i18n system
    - Create `src/i18n/types.ts` with Locale, LocaleConfig, and translation interfaces
    - Define types for translation namespaces and keys
    - Export type-safe translation function types
    - _Requirements: 2.1, 2.5, 2.6_
  
  - [x] 1.3 Write property test for translation file loading
    - **Property 3: Translation File Loading**
    - **Validates: Requirements 2.1**

- [ ] 2. Create Language Context and state management
  - [x] 2.1 Implement LanguageContext with React Context API
    - Create `src/contexts/LanguageContext.tsx`
    - Define LanguageContextValue interface with currentLanguage, changeLanguage, isRTL, direction
    - Implement context provider with state management
    - Add localStorage integration for language persistence
    - Implement language change handler that updates i18next and document attributes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2_
  
  - [x] 2.2 Create useLanguage custom hook
    - Create `src/hooks/useLanguage.ts`
    - Implement hook that consumes LanguageContext
    - Return currentLanguage, changeLanguage, isRTL, and translation function
    - Add error handling for usage outside provider
    - _Requirements: 2.2, 2.3_
  
  - [x] 2.3 Write property tests for language switching
    - **Property 1: Language Toggle**
    - **Validates: Requirements 1.1**
  
  - [x] 2.4 Write property test for language persistence
    - **Property 2: Language Preference Persistence Round-Trip**
    - **Validates: Requirements 1.2, 1.3**
  
  - [x] 2.5 Write unit tests for LanguageContext
    - Test default language is English when no preference exists
    - Test language change updates all context values
    - Test localStorage persistence and loading
    - Test error handling for localStorage unavailability
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Create translation files for all namespaces
  - [x] 3.1 Create common translations (English and Arabic)
    - Create `src/i18n/locales/en/common.json` with buttons, labels, messages
    - Create `src/i18n/locales/ar/common.json` with Arabic translations
    - Include: Add to Cart, Checkout, Login, Register, Submit, Cancel, Save, Delete, Edit, Search
    - Include: Email, Password, Name, Phone, Address labels
    - Include: Loading, Success, Error, No Results messages
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x] 3.2 Create navigation translations (English and Arabic)
    - Create `src/i18n/locales/en/navigation.json`
    - Create `src/i18n/locales/ar/navigation.json`
    - Include header navigation: Home, Shop, About, Contact, Cart, Wishlist, Account
    - Include footer sections: Quick Links, Customer Service, Follow Us, Copyright
    - _Requirements: 4.1, 4.6_
  
  - [x] 3.3 Create products translations (English and Arabic)
    - Create `src/i18n/locales/en/products.json`
    - Create `src/i18n/locales/ar/products.json`
    - Include product-related labels, category names, filter options
    - Include empty states: "No products found", product attributes
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 6.4_
  
  - [x] 3.4 Create cart translations (English and Arabic)
    - Create `src/i18n/locales/en/cart.json`
    - Create `src/i18n/locales/ar/cart.json`
    - Include cart page labels, quantity controls, subtotal, total
    - Include empty cart message, remove item confirmation
    - _Requirements: 7.1, 6.4_
  
  - [x] 3.5 Create checkout translations (English and Arabic)
    - Create `src/i18n/locales/en/checkout.json`
    - Create `src/i18n/locales/ar/checkout.json`
    - Include shipping/billing form labels, payment method labels
    - Include order confirmation messages, order status labels
    - _Requirements: 7.2, 7.3, 7.4, 7.5_
  
  - [x] 3.6 Create auth translations (English and Arabic)
    - Create `src/i18n/locales/en/auth.json`
    - Create `src/i18n/locales/ar/auth.json`
    - Include login, registration, password reset content
    - Include validation messages, success/error messages
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 3.7 Create admin translations (English and Arabic)
    - Create `src/i18n/locales/en/admin.json`
    - Create `src/i18n/locales/ar/admin.json`
    - Include dashboard labels, form labels, table headers
    - Include notification and confirmation messages
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 3.8 Create errors translations (English and Arabic)
    - Create `src/i18n/locales/en/errors.json`
    - Create `src/i18n/locales/ar/errors.json`
    - Include validation errors, API errors, network errors
    - Include 404, 500, and other error page messages
    - _Requirements: 4.4, 4.5, 6.5_
  
  - [x] 3.9 Write property tests for translation retrieval
    - **Property 5: Translation Retrieval with Fallback**
    - **Validates: Requirements 2.3, 2.4, 5.1, 5.2, 5.3, 5.4, 5.6**
  
  - [x] 3.10 Write property test for nested key support
    - **Property 6: Nested Translation Key Support**
    - **Validates: Requirements 2.5**
  
  - [x] 3.11 Write property test for variable interpolation
    - **Property 7: Variable Interpolation**
    - **Validates: Requirements 2.6**
  
  - [x] 3.12 Write unit tests for translation coverage
    - Test all navigation menu items have translations
    - Test all button labels have translations
    - Test all form labels have translations
    - Test validation error messages have translations
    - Test empty state messages have translations
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.4_

- [x] 4. Checkpoint - Verify i18n infrastructure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement RTL layout support
  - [x] 5.1 Create RTL Manager in LanguageContext
    - Add applyDirection function to update document.dir attribute
    - Add getDirection function to determine direction from locale
    - Update HTML lang attribute when language changes
    - Apply RTL-specific CSS classes to document root
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.2 Configure Tailwind CSS for RTL support
    - Install and configure Tailwind RTL plugin
    - Update tailwind.config.js with RTL configuration
    - Add RTL-aware utility classes
    - _Requirements: 3.3, 3.4_
  
  - [x] 5.3 Add Arabic font configuration
    - Add Google Fonts link for Cairo font in HTML head
    - Create font-family CSS classes for Arabic and English
    - Implement font switching logic in LanguageContext
    - Add appropriate line-height and letter-spacing for Arabic
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 5.4 Write property test for document direction
    - **Property 8: Document Direction Setting**
    - **Validates: Requirements 3.1, 3.2**
  
  - [x] 5.5 Write property test for number/date directionality
    - **Property 9: Number and Date Directionality Preservation**
    - **Validates: Requirements 3.5**
  
  - [x] 5.6 Write unit tests for RTL layout
    - Test Arabic locale applies dir="rtl" to document
    - Test English locale applies dir="ltr" to document
    - Test Arabic fonts are applied when Arabic is selected
    - Test CSS load failure fallback
    - _Requirements: 3.1, 3.2, 11.1, 11.4_

- [x] 6. Implement date, number, and currency formatting
  - [x] 6.1 Create formatting utilities
    - Create `src/i18n/formatters.ts` with locale-aware formatting functions
    - Implement formatDate function using Intl.DateTimeFormat
    - Implement formatNumber function using Intl.NumberFormat
    - Implement formatCurrency function with locale-specific currency formatting
    - Add error handling for invalid formats and unsupported locales
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 5.5_
  
  - [x] 6.2 Write property test for locale-specific formatting
    - **Property 10: Locale-Specific Formatting**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 5.5**
  
  - [x] 6.3 Write unit tests for formatting utilities
    - Test date formatting for both locales
    - Test number formatting with separators
    - Test currency formatting
    - Test error handling for invalid inputs
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 7. Create Language Switcher component
  - [x] 7.1 Implement LanguageSwitcher UI component
    - Create `src/components/LanguageSwitcher.tsx`
    - Implement button variant with current language display
    - Add click handler to toggle language using useLanguage hook
    - Add visual indicators for current language state
    - Style component with Tailwind CSS for both LTR and RTL
    - _Requirements: 1.1, 1.5_
  
  - [x] 7.2 Write unit tests for LanguageSwitcher
    - Test component renders with current language
    - Test clicking button triggers language change
    - Test visual indicators update correctly
    - Test component works in both LTR and RTL modes
    - _Requirements: 1.1, 1.5_

- [x] 8. Checkpoint - Verify RTL and formatting
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Integrate i18n with existing components
  - [x] 9.1 Wrap application with Translation Provider
    - Update `src/App.tsx` or main entry point
    - Wrap app with I18nProvider from i18n config
    - Wrap app with LanguageContext provider
    - Initialize i18n system on app load
    - _Requirements: 2.2_
  
  - [x] 9.2 Update navigation components with translations
    - Update Header component to use useTranslation hook
    - Replace hardcoded text with translation keys from navigation namespace
    - Update Footer component with translated content
    - Add LanguageSwitcher to Header
    - _Requirements: 4.1, 4.6_
  
  - [x] 9.3 Update product listing and detail components
    - Update ProductCard component to display translated product names and descriptions
    - Update ProductDetail component with translated content
    - Update category filters with translated category names
    - Implement fallback to English for missing product translations
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_
  
  - [x] 9.4 Update cart and checkout components
    - Update Cart component with translations from cart namespace
    - Update Checkout component with translations from checkout namespace
    - Update order confirmation with translated messages
    - Update order history with translated status labels
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ] 9.5 Update authentication components
    - Update Login component with translations from auth namespace
    - Update Register component with translated form labels
    - Update PasswordReset component with translated content
    - Update account management pages with translations
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 9.6 Update admin panel components
    - Update admin dashboard with translations from admin namespace
    - Update admin forms with translated labels
    - Update admin tables with translated headers
    - Update admin notifications with translated messages
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 9.7 Update static pages and content
    - Update About, Contact, Terms pages with translations
    - Update page titles and meta descriptions
    - Update breadcrumb navigation with translations
    - Update empty state messages across all pages
    - Update loading and error state messages
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 9.8 Update form components with formatting
    - Integrate formatDate, formatNumber, formatCurrency in relevant components
    - Update price displays with locale-aware formatting
    - Update date displays with locale-aware formatting
    - Ensure consistent formatting across all components
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 5.5_
  
  - [ ] 9.9 Write property test for translation function availability
    - **Property 4: Translation Function Availability**
    - **Validates: Requirements 2.2**
  
  - [ ] 9.10 Write integration tests for component translation
    - Test language change updates all visible components
    - Test RTL layout applies to all components in Arabic
    - Test product translations display correctly
    - Test checkout flow works in both languages
    - Test admin panel works in both languages
    - _Requirements: 1.1, 3.1, 3.2, 5.1, 7.1, 9.1_

- [ ] 10. Implement URL localization (optional)
  - [ ] 10.1 Add locale prefix to routing
    - Update routing configuration to include locale in URL paths
    - Implement locale detection from URL
    - Add redirect logic for URLs without locale prefix
    - Preserve query parameters and hash fragments during language switch
    - _Requirements: 12.1, 12.2, 12.5_
  
  - [ ] 10.2 Update SEO metadata for localized URLs
    - Update HTML lang attribute based on URL locale
    - Add hreflang tags for alternate language versions
    - Update meta descriptions for each locale
    - _Requirements: 12.4_
  
  - [ ] 10.3 Write property test for URL localization
    - **Property 11: URL Localization with Preservation**
    - **Validates: Requirements 12.1, 12.3**
  
  - [ ] 10.4 Write property test for URL redirect
    - **Property 12: URL Redirect Based on Preference**
    - **Validates: Requirements 12.2**
  
  - [ ] 10.5 Write property test for query/hash preservation
    - **Property 13: Query and Hash Preservation During Language Switch**
    - **Validates: Requirements 12.5**
  
  - [ ] 10.6 Write unit tests for URL routing
    - Test localized URLs load in correct language
    - Test invalid language codes redirect to default
    - Test query parameters are preserved
    - _Requirements: 12.1, 12.2, 12.3, 12.5_

- [ ] 11. Add error handling and fallbacks
  - [ ] 11.1 Implement error boundaries for i18n failures
    - Create error boundary component for translation errors
    - Add fallback UI for translation loading failures
    - Add logging for missing translation keys in development
    - _Requirements: 2.4_
  
  - [ ] 11.2 Add error handling for edge cases
    - Handle localStorage access denied gracefully
    - Handle translation file load failures with English fallback
    - Handle malformed translation files with error logging
    - Handle font loading failures with system font fallback
    - Handle invalid date/number formats with unformatted fallback
    - _Requirements: 1.2, 2.1, 2.4, 11.5_
  
  - [ ] 11.3 Write unit tests for error handling
    - Test missing translation keys return key as fallback
    - Test translation file load failure falls back to English
    - Test localStorage unavailable doesn't break language switching
    - Test font load failure falls back to system fonts
    - Test component errors are caught by error boundaries
    - _Requirements: 2.4, 11.5_

- [ ] 12. Final checkpoint - Complete integration testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and integration points
- The implementation follows a bottom-up approach: infrastructure → state management → translations → RTL → integration
- URL localization (Task 10) is marked as optional and can be implemented later if needed
- All translation files should be created in pairs (English and Arabic) to maintain consistency
