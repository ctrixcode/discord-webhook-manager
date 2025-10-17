import { defineRouting } from 'next-intl/routing';

export const localeMap = {
  en: 'English',
  es: 'Español',
};

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: Object.keys(localeMap),

  // Used when no locale matches
  defaultLocale: 'en',
});
