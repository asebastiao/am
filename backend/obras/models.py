from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime


class Obra(models.Model):
    """Obra do artista."""

    # ── Campos originais (já na BD) ──────────────────
    titulo      = models.CharField(max_length=200, verbose_name="Título")
    descricao   = models.TextField(verbose_name="Descrição", null=True, blank=True)
    imagem      = models.ImageField(upload_to='obras/', verbose_name="Imagem", help_text="Imagem da obra")
    tecnica     = models.CharField(max_length=100, verbose_name="Técnica")
    dimensoes   = models.CharField(max_length=80, verbose_name="Dimensões", blank=True,
                                   help_text='Ex: "130 × 105 cm"')
    ano_criacao = models.PositiveIntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(datetime.now().year + 1)],
        verbose_name="Ano de Criação"
    )
    disponivel  = models.BooleanField(default=True, verbose_name="Disponível")
    destaque    = models.BooleanField(default=False, verbose_name="Em destaque",
                                      help_text="Marque para exibir na página inicial")
    data_criacao     = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    # ── Campos novos (adicionados via migração 0004) ──
    slug         = models.SlugField(max_length=220, unique=True, blank=True)
    serie        = models.CharField(max_length=120, blank=True, verbose_name="Série / Colecção")
    local_actual = models.CharField(max_length=200, blank=True, verbose_name="Localização actual")
    exposicoes   = models.TextField(blank=True, verbose_name="Exposições")
    visivel      = models.BooleanField(default=True, verbose_name="Visível no site")

    class Meta:
        verbose_name        = "Obra"
        verbose_name_plural = "Obras"
        ordering            = ['-data_criacao']

    def __str__(self):
        return f"{self.titulo} ({self.ano_criacao})"

    @property
    def estado(self):
        """Compatibilidade com frontend que usa 'estado'."""
        return 'disponivel' if self.disponivel else 'vendida'

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            base = slugify(f"{self.titulo}-{self.ano_criacao}")
            slug, n = base, 1
            while Obra.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)


class ImagemObra(models.Model):
    """Imagens adicionais de uma obra."""
    obra    = models.ForeignKey(Obra, on_delete=models.CASCADE, related_name='imagens_extra')
    imagem  = models.ImageField(upload_to='obras/extra/', verbose_name="Imagem")
    legenda = models.CharField(max_length=200, blank=True)
    ordem   = models.PositiveSmallIntegerField(default=0)

    class Meta:
        verbose_name        = "Imagem adicional"
        verbose_name_plural = "Imagens adicionais"
        ordering            = ['ordem']

    def __str__(self):
        return f"Imagem de '{self.obra.titulo}' #{self.ordem}"
