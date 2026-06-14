from django.db import models


class Biografia(models.Model):
    """Modelo para biografia do artista - instância única"""

    nome      = models.CharField(max_length=100, verbose_name="Nome do Artista")
    subtitulo = models.CharField(max_length=200, blank=True, verbose_name="Subtítulo / Papel",
                                  help_text='Ex: "Artista Plástica & Escultural"')
    citacao   = models.TextField(blank=True, verbose_name="Citação / Statement Artístico",
                                  help_text="Frase de manifesto exibida em itálico")
    texto     = models.TextField(verbose_name="Texto Biográfico",
                                  help_text="Separe parágrafos com linha em branco (\\n\\n)")
    exposicoes = models.TextField(
        blank=True,
        verbose_name="Exposições & Prémios",
        help_text=(
            "Uma entrada por linha, formato: ano|local|título\n"
            "Ex: 2026|Galeria Lisboa|O Peso da Luz"
        )
    )
    imagem = models.ImageField(
        upload_to='biografia/',
        verbose_name="Foto do Artista",
        blank=True, null=True
    )
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = "Biografia"
        verbose_name_plural = "Biografia"

    def __str__(self):
        return f"Biografia de {self.nome}"

    @classmethod
    def get_biografia(cls):
        biografia, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                'nome':     'Nome do Artista',
                'texto':    'Biografia do artista...',
            }
        )
        return biografia

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
