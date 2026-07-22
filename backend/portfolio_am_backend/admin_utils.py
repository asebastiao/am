from django.conf import settings
from django.utils.html import format_html


def ver_no_site_button(path: str):
    """Renderiza um botão 'Ver no site' apontando para o frontend Next.js.

    `path` deve começar por '/' (ex: '/galeria/minha-obra-2024').
    Usado nos admins de todos os apps para o pedido: "ver no site,
    link que vai direcionar no frontend".
    """
    url = f"{settings.FRONTEND_URL}{path}"
    return format_html(
        '<a href="{}" target="_blank" rel="noopener noreferrer" '
        'style="padding:4px 10px;border-radius:4px;background:#2c3e50;color:#fff;'
        'text-decoration:none;font-size:12px;white-space:nowrap;">Ver no site ↗</a>',
        url
    )
