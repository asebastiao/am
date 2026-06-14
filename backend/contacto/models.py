from django.db import models
from django.utils import timezone


class MensagemContato(models.Model):
    """Modelo para mensagens de contato"""
    
    nome = models.CharField(max_length=100, verbose_name="Nome")
    email = models.EmailField(verbose_name="Email")
    telefone = models.CharField(max_length=20)
    assunto = models.CharField(max_length=200, verbose_name="Assunto")
    mensagem = models.TextField(verbose_name="Mensagem")
    data_envio = models.DateTimeField(auto_now_add=True, verbose_name="Data de Envio")
    
    # Campos para controle interno
    lida = models.BooleanField(default=False, verbose_name="Lida")
    respondida = models.BooleanField(default=False, verbose_name="Respondida")
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        verbose_name = "Mensagem de Contato"
        verbose_name_plural = "Mensagens de Contato"
        ordering = ['-data_envio']

    def __str__(self):
        return f"{self.nome} - {self.assunto}"

    def marcar_como_lida(self):
        """Marca a mensagem como lida"""
        self.lida = True
        self.save(update_fields=['lida'])

    def marcar_como_respondida(self):
        """Marca a mensagem como respondida"""
        self.respondida = True
        self.save(update_fields=['respondida'])


class ConfiguracaoContato(models.Model):
    # Dados de contato básicos
    telefone_contacto = models.CharField(max_length=20, blank=True, verbose_name="Telefone de Contato")
    email_contacto = models.EmailField(verbose_name="Email de Contacto")
    endereco = models.CharField(max_length=255, blank=True, verbose_name="Endereço")

    # Redes sociais - Nome e Link separados
    nome_facebook = models.CharField(max_length=100, blank=True, verbose_name="Nome no Facebook")
    link_facebook = models.URLField(blank=True, verbose_name="Link do Facebook")
    
    nome_instagram = models.CharField(max_length=100, blank=True, verbose_name="Nome no Instagram")
    link_instagram = models.URLField(blank=True, verbose_name="Link do Instagram")
    
    nome_x_twitter = models.CharField(max_length=100, blank=True, verbose_name="Nome no X (Twitter)")
    link_x_twitter = models.URLField(blank=True, verbose_name="Link do X (Twitter)")
    
    nome_whatsapp = models.CharField(max_length=100, blank=True, verbose_name="Nome no WhatsApp")
    link_whatsapp = models.CharField(max_length=20, blank=True, verbose_name="Número WhatsApp")

    # Configurações adicionais
    enviar_email_automatico = models.BooleanField(default=True, verbose_name="Enviar Email Automático")
    mensagem_agradecimento = models.TextField(
        default="Obrigado pelo seu contato! Responderemos em breve.", 
        verbose_name="Mensagem de Agradecimento"
    )
    ativo = models.BooleanField(default=True, verbose_name="Sistema Ativo")

    class Meta:
        verbose_name = "Configuração de Contato"
        verbose_name_plural = "Configurações de Contato"

    def __str__(self):
        return "Configurações de Contato"

    @classmethod
    def get_configuracao(cls):
        config, created = cls.objects.get_or_create(pk=1)
        return config

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
