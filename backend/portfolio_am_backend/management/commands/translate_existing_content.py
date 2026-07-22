"""
Comando único (correr uma vez após activar o multilingue) para gerar as
traduções em Inglês do conteúdo que já existia em Português antes da
tradução automática ter sido ligada.

Uso:
    python manage.py translate_existing_content
"""
from django.core.management.base import BaseCommand

from obras.models import Obra, ImagemObra
from galeria.models import ItemGaleria
from biografia.models import Biografia
from agenda.models import EventoAgenda
from contacto.models import ConfiguracaoContato


class Command(BaseCommand):
    help = "Gera as traduções em Inglês em falta para todo o conteúdo já existente."

    def handle(self, *args, **options):
        models = [Obra, ImagemObra, ItemGaleria, Biografia, EventoAgenda, ConfiguracaoContato]
        total = 0
        for model in models:
            count = 0
            for instance in model.objects.all():
                instance.save()  # o save() de cada modelo já chama autotranslate_instance
                count += 1
            self.stdout.write(f"  {model.__name__}: {count} registo(s) processado(s)")
            total += count
        self.stdout.write(self.style.SUCCESS(f"Concluído — {total} registo(s) verificados/traduzidos."))
