import { Artwork, Biography, AgendaEvent, ContactInfo, ContactMessage } from '@/types';

// Em SSR (Next.js Server Components) precisamos de URL absoluta.
// Em CSR (Contact Form submit) as rewrites do next.config tratam o /api.
const SERVER_BASE =
  process.env.BACKEND_URL ||
  (typeof window === 'undefined' ? 'http://localhost:8000' : '');

function serverUrl(path: string) {
  // No servidor usa URL absoluta; no browser as rewrites do Next tratam /api
  if (typeof window === 'undefined') {
    return `${SERVER_BASE}${path}`;
  }
  return path;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapObra(raw: Record<string, unknown>): Artwork {
  return {
    id:          raw.id as number,
    slug:        (raw.slug as string) ?? String(raw.id),
    title:       raw.titulo as string,
    year:        raw.ano_criacao as number,
    medium:      raw.tecnica as string,
    dimensions:  (raw.dimensoes as string) ?? (raw.dimensoes_display as string) ?? '',
    description: (raw.descricao as string) ?? '',
    image_url:   (raw.imagem as string) ?? '',
    status:      (raw.disponivel ? 'disponivel' : 'vendido') as Artwork['status'],
    featured:    (raw.destaque as boolean) ?? false,
  };
}

function mapBiografia(raw: Record<string, unknown>): Biography {
  const exposicoesList = (raw.exposicoes_lista as BiographyExpositionRaw[]) ?? [];
  return {
    name:         raw.nome as string,
    portrait_url: (raw.imagem as string) ?? '',
    role:         (raw.subtitulo as string) ?? '',
    statement:    (raw.citacao as string) ?? '',
    full_text:    (raw.paragrafos as string[]) ??
                  ((raw.texto as string)?.split('\n\n').filter(Boolean) ?? []),
    exposicoes_lista: exposicoesList,
    exhibitions_solo: exposicoesList
      .filter(e => !e.titulo?.startsWith('[colectiva]'))
      .map(e => `${e.ano} — ${e.titulo}${e.local ? ', ' + e.local : ''}`),
    exhibitions_group: exposicoesList
      .filter(e => e.titulo?.startsWith('[colectiva]'))
      .map(e => `${e.ano} — ${e.titulo.replace('[colectiva]', '').trim()}${e.local ? ', ' + e.local : ''}`),
    awards: [],
  };
}

interface BiographyExpositionRaw {
  ano: string;
  local: string;
  titulo: string;
}

function mapEvento(raw: Record<string, unknown>): AgendaEvent {
  return {
    id:          raw.id as number,
    title:       raw.titulo as string,
    date_string: (raw.date_string as string) ?? (raw.data_inicio as string) ?? '',
    location:    raw.local as string,
    description: (raw.descricao as string) ?? '',
    type:        raw.tipo as AgendaEvent['type'],
    upcoming:    (raw.upcoming as boolean) ?? false,
  };
}

// ─── Fetch helpers ───────────────────────────────────────────────────────────

async function apiFetch(path: string, options?: RequestInit) {
  const url = serverUrl(path);
  const res = await fetch(url, {
    ...options,
    // Server Components: sem cache por defeito para dados dinâmicos
    next: { revalidate: 60 },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json();
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getArtworks(): Promise<Artwork[]> {
  const data = await apiFetch('/api/obras/');
  const list = Array.isArray(data) ? data : (data.results ?? []);
  return list.map(mapObra);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  try {
    const data = await apiFetch(`/api/obras/${slug}/`);
    return mapObra(data);
  } catch {
    return null;
  }
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
  const data = await apiFetch('/api/obras/?destaque=true');
  const list = Array.isArray(data) ? data : (data.results ?? []);
  return list.map(mapObra);
}

export async function getBiography(): Promise<Biography | null> {
  try {
    const data = await apiFetch('/api/biografia/');
    return mapBiografia(data);
  } catch {
    return null;
  }
}

export async function getAgenda(): Promise<AgendaEvent[]> {
  const data = await apiFetch('/api/agenda/');
  const list = Array.isArray(data) ? data : (data.results ?? []);
  return list.map(mapEvento);
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const data = await apiFetch('/api/contacto/info/');
    return data as ContactInfo;
  } catch {
    return null;
  }
}

// ─── Client-side mutation (Contact Form) ─────────────────────────────────────

export async function submitContact(
  message: ContactMessage
): Promise<{ success: boolean; message: string }> {
  const payload = {
    nome:     message.name,
    email:    message.email,
    telefone: message.phone ?? '',
    assunto:  message.subject ??
              (message.artwork_interest_id
                ? `Interesse na obra #${message.artwork_interest_id}`
                : 'Contacto via portfolio'),
    mensagem: message.message,
  };

  const res = await fetch('/api/contacto/enviar/', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : (data?.error ?? 'Erro ao enviar mensagem.');
    return { success: false, message: errMsg };
  }
  return { success: true, message: data.message ?? 'Mensagem enviada com sucesso!' };
}
