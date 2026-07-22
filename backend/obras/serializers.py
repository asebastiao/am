from rest_framework import serializers
import re
from .models import Obra, ImagemObra


def optimize_cloudinary_url(url, transformation='f_auto,q_auto'):
    """
    Insere uma transformação de entrega automática nas URLs do Cloudinary
    (formato automático — WebP/AVIF quando o browser suporta — e qualidade
    automática). Reduz significativamente o peso das imagens sem exigir
    nenhum trabalho manual no upload. Não faz nada a URLs que não sejam
    do Cloudinary (ex: ficheiros locais em desenvolvimento).
    """
    if not url or 'res.cloudinary.com' not in url:
        return url
    # .../image/upload/v123/pasta/ficheiro.jpg → .../image/upload/f_auto,q_auto/v123/pasta/ficheiro.jpg
    return re.sub(r'(/image/upload/)(?!f_auto)', rf'\1{transformation}/', url, count=1)


def build_image_url(request, image_field):
    """Devolve URL absoluta e otimizada da imagem — funciona com Cloudinary e ficheiros locais."""
    if not image_field:
        return None
    url = image_field.url
    # Cloudinary já devolve URL absoluta (começa com https://)
    if url.startswith('http'):
        return optimize_cloudinary_url(url)
    # Ficheiro local — construir URL absoluta com request
    if request:
        return request.build_absolute_uri(url)
    return url


class ImagemObraSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model  = ImagemObra
        fields = ['id', 'imagem', 'legenda', 'ordem']

    def get_imagem(self, obj):
        return build_image_url(self.context.get('request'), obj.imagem)


class ObraSerializer(serializers.ModelSerializer):
    imagem            = serializers.SerializerMethodField()
    estado            = serializers.ReadOnlyField()   # property do modelo
    dimensoes_display = serializers.SerializerMethodField()

    class Meta:
        model  = Obra
        fields = [
            'id', 'slug', 'titulo', 'imagem', 'tecnica',
            'dimensoes', 'dimensoes_display', 'ano_criacao',
            'disponivel', 'estado', 'destaque',
        ]

    def get_imagem(self, obj):
        return build_image_url(self.context.get('request'), obj.imagem)

    def get_dimensoes_display(self, obj):
        return obj.dimensoes or ""


class ObraDetalheSerializer(serializers.ModelSerializer):
    imagem            = serializers.SerializerMethodField()
    estado            = serializers.ReadOnlyField()
    dimensoes_display = serializers.SerializerMethodField()
    imagens_extra     = ImagemObraSerializer(many=True, read_only=True)

    class Meta:
        model  = Obra
        fields = [
            'id', 'slug', 'titulo', 'descricao', 'imagem', 'imagens_extra',
            'tecnica', 'dimensoes', 'dimensoes_display',
            'ano_criacao', 'serie', 'local_actual', 'exposicoes',
            'disponivel', 'estado', 'destaque',
            'data_criacao', 'data_atualizacao',
        ]

    def get_imagem(self, obj):
        return build_image_url(self.context.get('request'), obj.imagem)

    def get_dimensoes_display(self, obj):
        return obj.dimensoes or ""
