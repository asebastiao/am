from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ItemGaleria
from .serializers import ItemGaleriaSerializer, ItemGaleriaListSerializer


class ItemGaleriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar itens da galeria.
    
    Permite operações CRUD e filtros por tipo e status.
    """
    queryset = ItemGaleria.objects.filter(ativo=True)
    serializer_class = ItemGaleriaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'ativo']
    search_fields = ['titulo', 'descricao']
    ordering_fields = ['ordem', 'data_criacao', 'data']
    ordering = ['ordem', '-data_criacao']

    def get_serializer_class(self):
        """Usa serializer simplificado para listagem"""
        if self.action == 'list':
            return ItemGaleriaListSerializer
        return ItemGaleriaSerializer

    def get_queryset(self):
        """Aplica filtros personalizados na queryset"""
        queryset = ItemGaleria.objects.all()
        
        # Por padrão, mostra apenas itens ativos
        if self.action == 'list':
            queryset = queryset.filter(ativo=True)
        
        # Filtro por tipo via query parameter
        tipo = self.request.query_params.get('tipo', None)
        if tipo:
            queryset = queryset.filter(tipo=tipo)
        
        return queryset

    @action(detail=False, methods=['get'])
    def por_tipo(self, request):
        """Endpoint para agrupar itens por tipo"""
        tipos = ItemGaleria.TIPO_CHOICES
        resultado = {}
        
        for tipo_key, tipo_label in tipos:
            itens = self.get_queryset().filter(tipo=tipo_key)
            serializer = ItemGaleriaListSerializer(itens, many=True, context={'request': request})
            resultado[tipo_key] = {
                'label': tipo_label,
                'itens': serializer.data
            }
        
        return Response(resultado)

    @action(detail=False, methods=['get'])
    def home(self, request):
        """Endpoint especial para a página home - retorna itens em destaque"""
        # Pega os primeiros 6 itens ordenados por ordem e data
        itens_home = self.get_queryset()[:6]
        serializer = ItemGaleriaListSerializer(itens_home, many=True, context={'request': request})
        return Response(serializer.data)
