from rest_framework import serializers
from .models import ItemGaleria
from obras.serializers import ObraSerializer, build_image_url


class ItemGaleriaListSerializer(serializers.ModelSerializer):
    imagem_url = serializers.SerializerMethodField()

    class Meta:
        model  = ItemGaleria
        fields = ['id', 'titulo', 'imagem_url', 'tipo', 'data', 'ordem']

    def get_imagem_url(self, obj):
        imagem = obj.imagem_display
        if not imagem:
            return None
        return build_image_url(self.context.get('request'), imagem)


class ItemGaleriaSerializer(serializers.ModelSerializer):
    imagem_url        = serializers.SerializerMethodField()
    descricao_display = serializers.ReadOnlyField()
    obra_detalhes     = ObraSerializer(source='obra', read_only=True)

    class Meta:
        model  = ItemGaleria
        fields = ['id', 'titulo', 'descricao', 'descricao_display', 'imagem', 'imagem_url',
                  'obra', 'obra_detalhes', 'tipo', 'data', 'data_criacao', 'ativo', 'ordem']
        read_only_fields = ['data_criacao']

    def get_imagem_url(self, obj):
        imagem = obj.imagem_display
        if not imagem:
            return None
        return build_image_url(self.context.get('request'), imagem)
