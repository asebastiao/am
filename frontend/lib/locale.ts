import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from './locale-constants';

export type { Locale };
export { DEFAULT_LOCALE, LOCALE_COOKIE };

/**
 * Lê o idioma escolhido pelo utilizador (cookie definido pelo
 * LocaleSwitcher no Navbar). Usado dentro de Server Components / lib/api.ts
 * para pedir ao backend o conteúdo no idioma certo via "Accept-Language".
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const store = await cookies();
    const value = store.get(LOCALE_COOKIE)?.value;
    return value === 'en' ? 'en' : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
