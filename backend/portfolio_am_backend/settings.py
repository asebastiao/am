import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ── Núcleo / Produção ─────────────────────────────────────
# DEBUG por omissão é False: só fica True se explicitamente definido no .env.
# Isto evita que um deploy sem .env configurado corra acidentalmente com DEBUG=True.
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

SECRET_KEY = os.environ.get('SECRET_KEY', '')
if not SECRET_KEY:
    if DEBUG:
        # Chave insegura só é aceite em desenvolvimento local.
        SECRET_KEY = 'dev-insecure-key-change-in-production'
    else:
        raise RuntimeError(
            'SECRET_KEY não está definido. Defina a variável de ambiente SECRET_KEY '
            'antes de arrancar em produção (DEBUG=False).'
        )

_allowed_hosts = os.environ.get('ALLOWED_HOSTS', '')
if _allowed_hosts:
    ALLOWED_HOSTS = [h.strip() for h in _allowed_hosts.split(',') if h.strip()]
elif DEBUG:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']
else:
    raise RuntimeError(
        'ALLOWED_HOSTS não está definido. Defina a variável de ambiente ALLOWED_HOSTS '
        '(ex: "meudominio.com,www.meudominio.com") antes de arrancar em produção.'
    )

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

INSTALLED_APPS = [
    'jazzmin',
    'django_extensions',
    'drf_spectacular',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'cloudinary',
    'obras',
    'galeria',
    'biografia',
    'contacto',
    'agenda',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'csp.middleware.CSPMiddleware',
]

ROOT_URLCONF = 'portfolio_am_backend.urls'

TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates', 'DIRS': [], 'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

WSGI_APPLICATION = 'portfolio_am_backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'pt-pt'
TIME_ZONE     = 'Africa/Luanda'
USE_I18N = True
USE_TZ   = True

# ── Static ──────────────────────────────────────────────
STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ── Media / Imagens ─────────────────────────────────────
# Em desenvolvimento: servir localmente de /media/
# Em produção: usar Cloudinary (credenciais no .env)

_cloudinary_configured = all([
    os.environ.get('CLOUDINARY_CLOUD_NAME'),
    os.environ.get('CLOUDINARY_API_KEY'),
    os.environ.get('CLOUDINARY_API_SECRET'),
])

if not DEBUG and not _cloudinary_configured:
    raise RuntimeError(
        'Cloudinary não está configurado (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / '
        'CLOUDINARY_API_SECRET). Em produção (DEBUG=False) o armazenamento local não é '
        'suportado — configure as credenciais do Cloudinary no ambiente.'
    )

if _cloudinary_configured:
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
        'API_KEY':    os.environ.get('CLOUDINARY_API_KEY'),
        'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
else:
    # Fallback local, permitido apenas em desenvolvimento (DEBUG=True).
    MEDIA_URL  = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── Segurança de produção (HTTPS, cookies, headers) ───────
# Todos estes controlos ficam desligados em DEBUG=True para não atrapalhar
# o desenvolvimento local em http://localhost, mas são obrigatórios em produção.
if not DEBUG:
    SECURE_SSL_REDIRECT = os.environ.get('SECURE_SSL_REDIRECT', 'True') == 'True'
    # Necessário quando está atrás de um proxy/load balancer que termina o TLS
    # (Hostinger, Render, etc.) para o Django saber que o pedido original era HTTPS.
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = False  # o JS do admin precisa de ler o token CSRF
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SAMESITE = 'Lax'

    SECURE_HSTS_SECONDS = int(os.environ.get('SECURE_HSTS_SECONDS', 31536000))  # 1 ano
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'
else:
    # Em dev, sem HTTPS, para não bloquear o localhost.
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False

# X-Frame-Options: nega o site a ser embebido em iframes de terceiros
X_FRAME_OPTIONS = 'DENY'

# CSRF: browsers modernos exigem que a origem do pedido esteja explicitamente
# autorizada quando se usam cookies (ex: login no Django Admin via HTTPS).
_csrf_trusted = os.environ.get('CSRF_TRUSTED_ORIGINS', '')
CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_trusted.split(',') if o.strip()]
if FRONTEND_URL and FRONTEND_URL not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(FRONTEND_URL)

# Content Security Policy (django-csp). Restringe de onde o browser pode
# carregar scripts/estilos/imagens — mitiga XSS. Ajustado para o Django Admin
# (Jazzmin usa fontes/ícones do próprio domínio) e imagens servidas pelo Cloudinary.
CONTENT_SECURITY_POLICY = {
    'DIRECTIVES': {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:', 'https://res.cloudinary.com'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': ["'self'"],
        'font-src': ["'self'", 'data:'],
        'frame-ancestors': ["'none'"],
        'object-src': ["'none'"],
    },
}

# ── Limites de upload ──────────────────────────────────────
# Protege contra pedidos/ficheiros excessivamente grandes (DoS por upload).
MAX_UPLOAD_SIZE_MB = int(os.environ.get('MAX_UPLOAD_SIZE_MB', 10))
DATA_UPLOAD_MAX_MEMORY_SIZE = MAX_UPLOAD_SIZE_MB * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = MAX_UPLOAD_SIZE_MB * 1024 * 1024

# ── REST Framework ───────────────────────────────────────
# Nota de segurança: a permissão por omissão é AllowAny porque toda a API
# pública é apenas de LEITURA (ReadOnlyModelViewSet / @api_view GET).
# Qualquer endpoint que precise de escrita (POST/PUT/PATCH/DELETE) define
# explicitamente permission_classes = [IsAdminUser] na própria view — nunca
# confiar apenas nesta configuração global para esses casos.
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '120/minute',
        'user': '300/minute',
    },
}

# ── CORS ─────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = DEBUG   # Em dev: aceita tudo. Em produção: nunca.
_cors_extra = os.environ.get('EXTRA_CORS_ORIGINS', '')
CORS_ALLOWED_ORIGINS = list(filter(None, set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    FRONTEND_URL,
    *[o.strip() for o in _cors_extra.split(',') if o.strip()],
])))
CORS_ALLOW_CREDENTIALS = True

# ── Email ────────────────────────────────────────────────
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST          = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
    EMAIL_PORT          = int(os.environ.get('EMAIL_PORT', 587))
    EMAIL_USE_TLS       = True
    EMAIL_HOST_USER     = os.environ.get('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

DEFAULT_FROM_EMAIL   = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@muhanguenaart.com')
CONTACT_NOTIFY_EMAIL = os.environ.get('CONTACT_NOTIFY_EMAIL', DEFAULT_FROM_EMAIL)

# ── Jazzmin ───────────────────────────────────────────────
JAZZMIN_SETTINGS = {
    "site_title": "Muhanguena Art",
    "site_header": "Muhanguena Art",
    "site_brand": "AM",
    "welcome_sign": "Bem-vindo ao painel de gestão",
    "copyright": "Azevedo Muhanguena",
    "search_model": ["obras.Obra", "contacto.MensagemContato"],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "obras.Obra": "fas fa-image",
        "galeria.ItemGaleria": "fas fa-images",
        "biografia.Biografia": "fas fa-user-circle",
        "contacto.MensagemContato": "fas fa-envelope",
        "contacto.ConfiguracaoContato": "fas fa-cog",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "show_sidebar": True,
    "navigation_expanded": True,
    "order_with_respect_to": ["obras", "galeria", "biografia", "contacto", "auth"],
    "topmenu_links": [
        {"name": "Ver site", "url": FRONTEND_URL, "new_window": True},
    ],
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar": "navbar-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_fixed": True,
    "accent": "accent-primary",
}
