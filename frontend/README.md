# Azevedo Muhanguena — Portfolio (Next.js 15)

Portfolio artístico migrado de Vite+React para **Next.js 15** com App Router.

## Stack

| Camada     | Tecnologia                       |
|------------|----------------------------------|
| Framework  | Next.js 15 (App Router)          |
| UI         | React 19                         |
| Estilo     | Tailwind CSS v4                  |
| Animações  | Motion (Framer Motion v12)       |
| Ícones     | Lucide React                     |
| Backend    | Django REST Framework (separado) |

## Estrutura de rotas

```
/              → Página inicial (Hero + Editorial + Obras em destaque)
/galeria       → Galeria completa com filtros
/galeria/[slug] → Detalhe de obra individual
/biografia     → Biografia e CV do artista
/agenda        → Timeline de eventos e exposições
/contacto      → Formulário de contacto (aceita ?obra=ID)
```

## Início rápido

```bash
# Instalar dependências
npm install

# Arrancar em desenvolvimento (o backend Django deve estar em http://localhost:8000)
npm run dev

# Build de produção
npm run build && npm start
```

## Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e ajuste:

```env
# URL do backend Django (Next.js reescreve /api e /media para cá)
BACKEND_URL=http://localhost:8000

# URL pública do site (usado em metadados SEO)
NEXT_PUBLIC_SITE_URL=https://helenabrandao.com
```

Em produção defina `BACKEND_URL` com o URL real do servidor Django.

## Arquitectura SSR/SSG

- **Server Components** fazem fetch directo ao backend Django (SSR por defeito, revalida a cada 60s).
- **Client Components** (`'use client'`) são usados apenas onde necessário: Navbar, GalleryGrid, formulários com estado, animações.
- O **dark mode** é gerido via `ThemeProvider` (Context API + localStorage).
- A navegação entre páginas é feita via `next/link` e `useRouter` — sem SPA manual de `useState`.
