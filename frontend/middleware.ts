import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Corre em todas as rotas da app (incluindo as páginas em Português sem
  // prefixo, já que localePrefix é 'as-needed'), exceto ficheiros
  // estáticos e a API interna do Next. Sem isto, o Next.js tenta casar
  // caminhos como "/galeria" diretamente com app/[locale]/page.tsx,
  // interpretando "galeria" como o valor do parâmetro de idioma — o que
  // faz renderizar sempre a Home.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
