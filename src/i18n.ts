import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// A list of all locales that are supported
const locales = ['en', 'es', 'hi'];
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    locale, // This is the new required line
  }
});
