// ─── Obras ─────────────────────────────────────────────────────────────────
export interface Artwork {
  id: number;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  description?: string;
  image_url: string;
  status: 'disponivel' | 'vendido' | 'colecao_particular';
  featured: boolean;
}

// ─── Biografia ─────────────────────────────────────────────────────────────
export interface BiographyExposition {
  ano:    string;
  local:  string;
  titulo: string;
}

export interface Biography {
  name:             string;
  portrait_url:     string;
  role:             string;
  statement:        string;
  full_text:        string[];
  exposicoes_lista: BiographyExposition[];
  exhibitions_solo:  string[];
  exhibitions_group: string[];
  awards:            string[];
}

// ─── Agenda ────────────────────────────────────────────────────────────────
export interface AgendaEvent {
  id:          number;
  title:       string;
  date_string: string;
  location:    string;
  description: string;
  type:        'exposicao' | 'workshop' | 'palestra' | 'evento';
  upcoming:    boolean;
}

// ─── Contacto ──────────────────────────────────────────────────────────────
export interface ContactMessage {
  name:     string;
  email:    string;
  phone?:   string;
  message:  string;
  subject?: string;
  artwork_interest_id?: number | null;
}

export interface ContactInfo {
  telefone_contacto: string;
  email_contacto:    string;
  endereco:          string;
  nome_instagram:    string;
  link_instagram:    string;
  nome_facebook:     string;
  link_facebook:     string;
  nome_whatsapp:     string;
  link_whatsapp:     string;
  mensagem_agradecimento: string;
}
