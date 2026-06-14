from django.contrib import admin
from .models import MensagemContato, ConfiguracaoContato


@admin.register(MensagemContato)
class MensagemContatoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'telefone', 'assunto', 'data_envio', 'lida', 'respondida')
    list_filter = ('lida', 'respondida', 'data_envio')
    search_fields = ('nome', 'email', 'assunto', 'mensagem')
    readonly_fields = ('data_envio', 'ip_address', 'user_agent')
    actions = ['marcar_como_lida']

    @admin.action(description="Marcar mensagens selecionadas como lidas")
    def marcar_como_lida(self, request, queryset):
        queryset.update(lida=True)


@admin.register(ConfiguracaoContato)
class ConfiguracaoContatoAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('telefone_contacto', 'email_contacto', 'endereco')
        }),
        ('Facebook', {
            'fields': ('nome_facebook', 'link_facebook'),
            'classes': ('collapse',),
        }),
        ('Instagram', {
            'fields': ('nome_instagram', 'link_instagram'),
            'classes': ('collapse',),
        }),
        ('X (Twitter)', {
            'fields': ('nome_x_twitter', 'link_x_twitter'),
            'classes': ('collapse',),
        }),
        ('WhatsApp', {
            'fields': ('nome_whatsapp', 'link_whatsapp'),
            'classes': ('collapse',),
        }),
        ('Configurações do Sistema', {
            'fields': ('enviar_email_automatico', 'mensagem_agradecimento', 'ativo'),
        }),
    )

    def has_add_permission(self, request):
        # Impede a criação de múltiplas configurações
        return not ConfiguracaoContato.objects.exists()

    def has_delete_permission(self, request, obj=None):
        # Impede a exclusão da configuração
        return False

    def changelist_view(self, request, extra_context=None):
        # Redireciona automaticamente para a única instância
        try:
            config = ConfiguracaoContato.objects.get(pk=1)
            from django.shortcuts import redirect
            return redirect(f'/admin/{self.model._meta.app_label}/{self.model._meta.model_name}/{config.pk}/change/')
        except ConfiguracaoContato.DoesNotExist:
            return super().changelist_view(request, extra_context)
