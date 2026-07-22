'use client';

import { ContactMessage } from '@/types';

// ─── Client-side mutation (Contact Form) ─────────────────────────────────────
// Este ficheiro é seguro para importar a partir de Client Components: não
// depende de "next/headers" (ao contrário de lib/api.ts, usado apenas em
// Server Components).

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
