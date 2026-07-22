import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
  localePrefix: 'as-needed' // Only prefix when necessary, or 'always'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
