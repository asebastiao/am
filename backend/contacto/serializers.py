from rest_framework import serializers
from .models import ConfiguracaoContato, MensagemContato

class InfoContatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoContato
        fields = [
            "telefone_contacto",
            "email_contacto",
            "endereco",
            "nome_facebook",
            "link_facebook",
            "nome_instagram", 
            "link_instagram",
            "nome_x_twitter",
            "link_x_twitter",
            "nome_whatsapp",
            "link_whatsapp",
            "mensagem_agradecimento",
            "ativo",
        ]

class EnviarMensagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MensagemContato
        fields = ['nome', 'email', 'telefone', 'assunto', 'mensagem']

    def create(self, validated_data):
        """Cria a mensagem com informações adicionais do request"""
        request = self.context.get('request')
        
        if request:
            # Captura IP e User-Agent
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            validated_data['ip_address'] = ip
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        return super().create(validated_data)
