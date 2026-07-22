from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from portfolio_am_backend.permissions import IsAdminOrReadOnly
from .models import ItemGaleria
from .serializers import ItemGaleriaSerializer, ItemGaleriaListSerializer


class ItemGaleriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar itens da galeria.

    Leitura (GET) é pública. Escrita (POST/PUT/PATCH/DELETE) exige conta
    de staff autenticada — a gestão de conteúdo deve ser feita no Django Admin.
    """
    queryset = ItemGaleria.objects.filter(ativo=True)
    serializer_class = ItemGaleriaSerializer
    permission_classes = [IsAdminOrReadOnly]
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
    def destaque(self, request):
        """Endpoint para o carrossel da página inicial: só os itens
        marcados como Destaque no Django admin, ordenados por `ordem`.
        Continuam a aparecer normalmente em Exposições/Arquivo na Galeria —
        "Destaque" só controla o carrossel da Home."""
        itens = self.get_queryset().filter(destaque=True).order_by('ordem', '-data_criacao')
        serializer = ItemGaleriaListSerializer(itens, many=True, context={'request': request})
        return Response(serializer.data)
