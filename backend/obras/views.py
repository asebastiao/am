from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Obra
from .serializers import ObraSerializer, ObraDetalheSerializer


class ObraViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Lista e detalhe de obras.
    Filtra apenas obras visíveis (campo visivel=True).
    Se o campo visivel ainda não existir na BD (antes da migração),
    devolve todas as obras.
    """
    serializer_class = ObraSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['disponivel', 'tecnica', 'ano_criacao', 'destaque']
    search_fields    = ['titulo', 'descricao', 'tecnica']
    ordering_fields  = ['ano_criacao', 'data_criacao', 'titulo']
    ordering         = ['-data_criacao']
    lookup_field     = 'slug'

    def get_queryset(self):
        try:
            return Obra.objects.filter(visivel=True).order_by('-data_criacao')
        except Exception:
            # Campo visivel ainda não existe na BD — fallback seguro
            return Obra.objects.all().order_by('-data_criacao')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ObraDetalheSerializer
        return ObraSerializer


@api_view(['GET'])
def obras_disponiveis(request):
    """Obras com disponivel=True."""
    try:
        obras = Obra.objects.filter(disponivel=True, visivel=True).order_by('-data_criacao')
    except Exception:
        obras = Obra.objects.filter(disponivel=True).order_by('-data_criacao')
    serializer = ObraSerializer(obras, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def obras_destaque(request):
    """
    Obras com destaque=True.
    Fallback: as 8 mais recentes se nenhuma estiver em destaque.
    """
    try:
        obras = Obra.objects.filter(destaque=True, visivel=True).order_by('-data_criacao')
        if not obras.exists():
            obras = Obra.objects.filter(visivel=True).order_by('-data_criacao')[:8]
    except Exception:
        obras = Obra.objects.filter(destaque=True).order_by('-data_criacao')
        if not obras.exists():
            obras = Obra.objects.all().order_by('-data_criacao')[:8]
    serializer = ObraSerializer(obras, many=True, context={'request': request})
    return Response(serializer.data)
