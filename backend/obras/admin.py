from django.contrib import admin
from django.utils.html import format_html
from .models import Obra, ImagemObra


class ImagemObraInline(admin.TabularInline):
    model   = ImagemObra
    extra   = 1
    fields  = ('imagem', 'preview_inline', 'legenda', 'ordem')
    readonly_fields = ('preview_inline',)
    ordering = ('ordem',)

    def preview_inline(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" style="height:56px;width:56px;object-fit:cover;border-radius:4px;" />', obj.imagem.url)
        return "—"
    preview_inline.short_description = "Preview"


@admin.register(Obra)
class ObraAdmin(admin.ModelAdmin):
    list_display    = ['thumb', 'titulo', 'tecnica', 'ano_criacao', 'badge_disponivel', 'destaque', 'visivel', 'data_criacao']
    list_display_links = ['thumb', 'titulo']
    list_filter     = ['disponivel', 'destaque', 'visivel', 'ano_criacao']
    search_fields   = ['titulo', 'descricao', 'tecnica']
    list_editable   = ['destaque', 'visivel']
    readonly_fields = ['slug', 'data_criacao', 'data_atualizacao', 'imagem_preview']
    inlines         = [ImagemObraInline]
    ordering        = ['-data_criacao']

    fieldsets = (
        ('Imagem', {'fields': ('imagem', 'imagem_preview')}),
        ('Informação', {'fields': ('titulo', 'slug', 'descricao', 'tecnica', 'dimensoes', 'ano_criacao')}),
        ('Contexto', {'fields': ('serie', 'local_actual', 'exposicoes'), 'classes': ('collapse',)}),
        ('Estado e visibilidade', {'fields': ('disponivel', 'destaque', 'visivel')}),
        ('Datas', {'fields': ('data_criacao', 'data_atualizacao'), 'classes': ('collapse',)}),
    )

    actions = ['marcar_disponivel', 'marcar_indisponivel', 'colocar_destaque', 'retirar_destaque', 'ocultar', 'tornar_visivel']

    @admin.display(description="")
    def thumb(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" style="height:48px;width:48px;object-fit:cover;border-radius:4px;" />', obj.imagem.url)
        return format_html('<span style="color:#ccc;font-size:11px;">sem imagem</span>')

    @admin.display(description="Estado")
    def badge_disponivel(self, obj):
        if obj.disponivel:
            return format_html('<span style="background:#e6f4ea;color:#1e7e34;padding:2px 9px;border-radius:3px;font-size:11px;">Disponível</span>')
        return format_html('<span style="background:#f3f3f3;color:#888;padding:2px 9px;border-radius:3px;font-size:11px;">Vendida</span>')

    @admin.display(description="Preview")
    def imagem_preview(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" style="max-width:300px;max-height:300px;object-fit:contain;border-radius:6px;border:1px solid #eee;" />', obj.imagem.url)
        return "Nenhuma imagem"

    @admin.action(description="✔ Marcar como Disponível")
    def marcar_disponivel(self, request, qs):
        qs.update(disponivel=True)

    @admin.action(description="✖ Marcar como Vendida")
    def marcar_indisponivel(self, request, qs):
        qs.update(disponivel=False)

    @admin.action(description="⭐ Colocar em destaque")
    def colocar_destaque(self, request, qs):
        qs.update(destaque=True)

    @admin.action(description="☆ Retirar do destaque")
    def retirar_destaque(self, request, qs):
        qs.update(destaque=False)

    @admin.action(description="👁 Tornar visível")
    def tornar_visivel(self, request, qs):
        qs.update(visivel=True)

    @admin.action(description="🚫 Ocultar do site")
    def ocultar(self, request, qs):
        qs.update(visivel=False)
