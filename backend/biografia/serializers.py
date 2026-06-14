from rest_framework import serializers
from .models import Biografia
from obras.serializers import build_image_url


class BiografiaSerializer(serializers.ModelSerializer):
    paragrafos       = serializers.SerializerMethodField()
    exposicoes_lista = serializers.SerializerMethodField()
    imagem           = serializers.SerializerMethodField()

    class Meta:
        model  = Biografia
        fields = ['nome', 'subtitulo', 'texto', 'paragrafos',
                  'citacao', 'imagem', 'exposicoes', 'exposicoes_lista', 'data_atualizacao']
        read_only_fields = ['data_atualizacao']

    def get_imagem(self, obj):
        if not obj.imagem:
            return None
        return build_image_url(self.context.get('request'), obj.imagem)

    def get_paragrafos(self, obj):
        if not obj.texto:
            return []
        return [p.strip() for p in obj.texto.split('\n\n') if p.strip()]

    def get_exposicoes_lista(self, obj):
        if not obj.exposicoes:
            return []
        resultado = []
        for linha in obj.exposicoes.strip().splitlines():
            linha = linha.strip()
            if not linha:
                continue
            partes = [p.strip() for p in linha.split('|')]
            resultado.append({
                'ano':    partes[0] if len(partes) > 0 else '',
                'local':  partes[1] if len(partes) > 1 else '',
                'titulo': partes[2] if len(partes) > 2 else '',
            })
        return resultado
