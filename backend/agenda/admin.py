from django.contrib import admin
from .models import EventoAgenda


@admin.register(EventoAgenda)
class EventoAgendaAdmin(admin.ModelAdmin):
    list_display  = ['titulo', 'tipo', 'data_inicio', 'data_fim', 'local', 'ativo', 'ordem']
    list_filter   = ['tipo', 'ativo']
    search_fields = ['titulo', 'descricao', 'local']
    list_editable = ['ativo', 'ordem']
    ordering      = ['data_inicio']
    fieldsets = (
        (None, {
            'fields': ('titulo', 'tipo', 'descricao')
        }),
        ('Data & Local', {
            'fields': ('data_inicio', 'data_fim', 'local')
        }),
        ('Visibilidade', {
            'fields': ('ativo', 'ordem')
        }),
    )
