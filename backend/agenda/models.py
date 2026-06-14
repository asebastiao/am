from django.db import models
from django.utils.translation import gettext_lazy as _


class EventoAgenda(models.Model):
    TIPO_CHOICES = [
        ('exposicao', _('Exposição')),
        ('workshop',  _('Workshop')),
        ('palestra',  _('Palestra / Conferência')),
        ('evento',    _('Vernissage / Evento')),
    ]

    titulo      = models.CharField(_('Título'), max_length=255)
    data_inicio = models.DateField(_('Data de Início'))
    data_fim    = models.DateField(_('Data de Fim'), null=True, blank=True,
                                   help_text=_('Deixe em branco se for evento de um único dia'))
    local       = models.CharField(_('Local'), max_length=255)
    descricao   = models.TextField(_('Descrição'), blank=True)
    tipo        = models.CharField(_('Tipo'), max_length=20, choices=TIPO_CHOICES, default='evento')
    ativo       = models.BooleanField(_('Activo'), default=True)
    ordem       = models.PositiveIntegerField(_('Ordem'), default=0)

    data_criacao     = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = _('Evento da Agenda')
        verbose_name_plural = _('Eventos da Agenda')
        ordering            = ['data_inicio']

    def __str__(self):
        return f"{self.titulo} ({self.data_inicio})"

    @property
    def upcoming(self):
        from django.utils import timezone
        return self.data_inicio >= timezone.now().date()

    @property
    def date_string(self):
        """Formata a data para exibição no frontend."""
        from django.utils.formats import date_format
        meses_pt = {
            1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
            5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
            9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro',
        }
        inicio = self.data_inicio
        if self.data_fim and self.data_fim != inicio:
            fim = self.data_fim
            if inicio.year == fim.year and inicio.month == fim.month:
                return f"{inicio.day}–{fim.day} {meses_pt[inicio.month]}, {inicio.year}"
            else:
                return (
                    f"{inicio.day} {meses_pt[inicio.month]} — "
                    f"{fim.day} {meses_pt[fim.month]}, {fim.year}"
                )
        return f"{inicio.day} {meses_pt[inicio.month]}, {inicio.year}"
