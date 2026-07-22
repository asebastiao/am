from django.conf import settings
from django.core.mail import send_mail
from django_ratelimit.decorators import ratelimit
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ConfiguracaoContato
from .serializers import InfoContatoSerializer, EnviarMensagemSerializer


@api_view(['GET'])
def info_contato(request):
    """Retorna as infos de contacto do site"""
    config = ConfiguracaoContato.get_configuracao()
    serializer = InfoContatoSerializer(config)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@ratelimit(key='ip', rate='5/m', block=True)
def enviar_mensagem(request):
    """
    Endpoint para envio de mensagem do usuário ao dono do site.
    Limitado a 5 pedidos por minuto por IP para evitar abuso/spam
    (protecção adicional às validações de campo do serializer).
    """
    config = ConfiguracaoContato.get_configuracao()
    if not config.ativo:
        return Response({'success': False, 'error': 'O sistema de mensagens está inativo.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = EnviarMensagemSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    mensagem = serializer.save()
    if config.enviar_email_automatico and config.email_contacto:
        try:
            send_mail(
                subject=f'Nova mensagem de contato: {mensagem.assunto}',
                message=f'Nome: {mensagem.nome}\n'
                        f'Email: {mensagem.email}\n'
                        f'Telefone: {mensagem.telefone}\n\n'
                        f'Mensagem:\n{mensagem.mensagem}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[config.email_contacto],
                fail_silently=True,
            )
        except Exception as e:
            # Não interrompe a resposta ao utilizador só porque o email falhou;
            # a mensagem já foi guardada na base de dados e fica visível no Admin.
            import logging
            logging.getLogger(__name__).warning("Falha ao enviar email de notificação de contacto: %s", e)

    return Response({
        'success': True,
        'message': config.mensagem_agradecimento
    }, status=status.HTTP_201_CREATED)
