from django.contrib import admin
from django.utils.html import format_html
from .models import Biografia


@admin.register(Biografia)
class BiografiaAdmin(admin.ModelAdmin):
    """Admin para o modelo Biografia"""

    list_display = [
        'nome',
        'imagem_thumbnail',
        'data_atualizacao',
    ]

    readonly_fields = [
        'data_atualizacao',
        'imagem_preview',
    ]

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'texto', 'imagem', 'imagem_preview')
        }),
        ('Sistema', {
            'fields': ('data_atualizacao',),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        """Impede a criação de múltiplas biografias"""
        return not Biografia.objects.exists()

    def has_delete_permission(self, request, obj=None):
        """Impede a exclusão da biografia"""
        return False

    def imagem_thumbnail(self, obj):
        """Exibe thumbnail da imagem na lista"""
        if obj.imagem:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 50%;" />',
                obj.imagem.url
            )
        return "Sem foto"
    imagem_thumbnail.short_description = "Foto"

    def imagem_preview(self, obj):
        """Exibe preview da imagem no formulário"""
        if obj.imagem:
            return format_html(
                '<img src="{}" width="200" style="border-radius: 8px;" />',
                obj.imagem.url
            )
        return "Nenhuma imagem carregada"
    imagem_preview.short_description = "Preview da Foto"
