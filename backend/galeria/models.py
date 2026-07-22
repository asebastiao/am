from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from obras.models import Obra
from portfolio_am_backend.validators import validate_image_file
import os


def galeria_image_path(instance, filename):
    """Gera o caminho para upload de imagens da galeria"""
    name, ext = os.path.splitext(filename)
    safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
    return f'galeria/{safe_name}{ext}'


class ItemGaleria(models.Model):
    """
    Modelo para itens da galeria que podem ser:
    - Imagens individuais (upload direto)
    - Referências a obras existentes
    """
    
    TIPO_CHOICES = [
        ('exposicao', _('Exposição')),
        ('arquivo', _('Arquivo')),
    ]
    
    titulo = models.CharField(
        _('Título'),
        max_length=200,
        null=True, blank=True,
        help_text=_('Título do item da galeria')
    )
    
    descricao = models.TextField(
        _('Descrição'),
        blank=True,
        help_text=_('Descrição do item da galeria')
    )
    
    imagem = models.ImageField(
        _('Imagem'),
        upload_to=galeria_image_path,
        blank=True,
        null=True,
        help_text=_('Imagem individual (use apenas se não referenciar uma obra)'),
        validators=[validate_image_file],
    )
    
    obra = models.ForeignKey(
        Obra,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name=_('Obra Relacionada'),
        help_text=_('Obra existente (use apenas se não carregar imagem individual)')
    )
    
    tipo = models.CharField(
        _('Tipo'),
        max_length=20,
        choices=TIPO_CHOICES,
        default='arquivo',
        help_text=_('Tipo do item da galeria')
    )
    
    data = models.DateField(
        _('Data'),
        null=True,
        blank=True,
        help_text=_('Data relacionada ao item (evento, exposição, etc.)')
    )
    
    data_criacao = models.DateTimeField(
        _('Data de Criação'),
        auto_now_add=True
    )
    
    data_atualizacao = models.DateTimeField(
        _('Data de Atualização'),
        auto_now=True
    )
    
    ativo = models.BooleanField(
        _('Ativo'),
        default=True,
        help_text=_('Se o item deve ser exibido na galeria')
    )
    
    ordem = models.PositiveIntegerField(
        _('Ordem'),
        default=0,
        help_text=_('Ordem de exibição (menor número aparece primeiro)')
    )

    destaque = models.BooleanField(
        _('Destaque (Carrossel da Home)'),
        default=False,
        help_text=_(
            'Marque para esta imagem aparecer no carrossel da página inicial. '
            'O item continua a aparecer normalmente em Exposições/Arquivo na Galeria.'
        )
    )

    class Meta:
        verbose_name = _('Item da Galeria')
        verbose_name_plural = _('Itens da Galeria')
        ordering = ['ordem', '-data_criacao']

    def __str__(self):
        return self.titulo or "Item da Galeria"

    def clean(self):
        """Validação personalizada para garantir que apenas um dos campos seja preenchido"""
        if not self.imagem and not self.obra:
            raise ValidationError(
                _('Você deve fornecer uma imagem OU selecionar uma obra existente.')
            )
        
        if self.imagem and self.obra:
            raise ValidationError(
                _('Você deve fornecer APENAS uma imagem OU uma obra, não ambos.')
            )

    def save(self, *args, **kwargs):
        """Override do save para executar validação"""
        self.clean()
        super().save(*args, **kwargs)

    @property
    def imagem_display(self):
        """Retorna a imagem a ser exibida (própria ou da obra)"""
        if self.imagem:
            return self.imagem
        elif self.obra and self.obra.imagem:
            return self.obra.imagem
        return None

    @property
    def imagem_url(self):
        """Retorna a URL da imagem a ser exibida"""
        imagem = self.imagem_display
        return imagem.url if imagem else None

    @property
    def descricao_display(self):
        """Retorna a descrição (própria ou da obra)"""
        if self.descricao:
            return self.descricao
        elif self.obra:
            return self.obra.descricao
        return ""
