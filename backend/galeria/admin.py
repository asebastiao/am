from django.contrib import admin
from django.utils.html import format_html
from .models import ItemGaleria


@admin.register(ItemGaleria)
class ItemGaleriaAdmin(admin.ModelAdmin):
    """Configuração do admin para o modelo ItemGaleria"""
    view_on_site = True

    def get_view_on_site_url(self, obj=None):
        """Retorna a URL no frontend para este item da galeria.
        - Se o item referencia uma obra: abre a página da obra no frontend (/galeria/{slug})
        - Caso contrário: abre a página geral da galeria (/galeria)
        """
        from django.conf import settings
        frontend = settings.FRONTEND_URL.rstrip('/')
        if obj is None:
            return frontend + '/galeria'
        if getattr(obj, 'obra', None):
            try:
                slug = obj.obra.slug
                return f"{frontend}/galeria/{slug}"
            except Exception:
                return frontend + '/galeria'
        return frontend + '/galeria'

    list_display = [
        'titulo',
        'imagem_thumbnail',
        'tipo',
        'obra_relacionada',
        'ativo',
        'destaque',
        'ordem',
        'data_criacao'
    ]
    
    list_filter = [
        'tipo',
        'ativo',
        'destaque',
        'data_criacao',
        'data'
    ]
    
    list_editable = ['ativo', 'destaque', 'ordem']
    
    search_fields = [
        'titulo',
        'descricao',
        'obra__titulo'
    ]
    
    readonly_fields = [
        'data_criacao',
        'data_atualizacao',
        'imagem_preview'
    ]
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'descricao', 'tipo', 'data')
        }),
        ('Conteúdo', {
            'fields': ('imagem', 'obra', 'imagem_preview'),
            'description': 'Forneça APENAS uma imagem OU selecione uma obra existente, não ambos.'
        }),
        ('Configurações', {
            'fields': ('ativo', 'destaque', 'ordem'),
            'description': 'Marque "Destaque" para esta imagem entrar no carrossel da página inicial. O item continua visível em Exposições/Arquivo na Galeria de qualquer forma.',
        }),
        ('Datas', {
            'fields': ('data_criacao', 'data_atualizacao'),
            'classes': ('collapse',)
        }),
    )
    
    ordering = ['ordem', '-data_criacao']
    
    def imagem_thumbnail(self, obj):
        """Exibe thumbnail da imagem na lista"""
        imagem = obj.imagem_display
        if imagem:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                imagem.url
            )
        return "Sem imagem"
    imagem_thumbnail.short_description = "Imagem"
    
    def obra_relacionada(self, obj):
        """Mostra a obra relacionada se houver"""
        if obj.obra:
            return obj.obra.titulo
        return "-"
    obra_relacionada.short_description = "Obra"
    
    def imagem_preview(self, obj):
        """Exibe preview da imagem no formulário"""
        imagem = obj.imagem_display
        if imagem:
            return format_html(
                '<img src="{}" width="200" style="border-radius: 8px;" />',
                imagem.url
            )
        return "Nenhuma imagem disponível"
    imagem_preview.short_description = "Preview da Imagem"
    
    actions = ['ativar_itens', 'desativar_itens', 'marcar_destaque', 'retirar_destaque']
    
    def ativar_itens(self, request, queryset):
        """Ação para ativar itens"""
        updated = queryset.update(ativo=True)
        self.message_user(request, f'{updated} item(ns) ativado(s).')
    ativar_itens.short_description = "Ativar itens selecionados"
    
    def desativar_itens(self, request, queryset):
        """Ação para desativar itens"""
        updated = queryset.update(ativo=False)
        self.message_user(request, f'{updated} item(ns) desativado(s).')
    desativar_itens.short_description = "Desativar itens selecionados"

    def marcar_destaque(self, request, queryset):
        updated = queryset.update(destaque=True)
        self.message_user(request, f'{updated} item(ns) colocado(s) em destaque no carrossel.')
    marcar_destaque.short_description = "⭐ Colocar em destaque (carrossel da Home)"

    def retirar_destaque(self, request, queryset):
        updated = queryset.update(destaque=False)
        self.message_user(request, f'{updated} item(ns) retirado(s) do destaque.')
    retirar_destaque.short_description = "☆ Retirar do destaque"
