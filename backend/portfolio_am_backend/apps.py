from django.apps import AppConfig


class PortfolioAmBackendConfig(AppConfig):
    """Regista o pacote do projecto como app Django para que os comandos de
    gestão em `management/commands/` (ex: translate_existing_content,
    setup_initial_data) sejam descobertos pelo `manage.py`."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'portfolio_am_backend'
    label = 'portfolio_am_backend'
