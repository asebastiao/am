from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from portfolio_am_backend.permissions import IsAdminOrReadOnly
from .models import EventoAgenda
from .serializers import EventoAgendaSerializer


class EventoAgendaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerir eventos da agenda.
    GET /api/agenda/          → lista todos os eventos activos (público)
    GET /api/agenda/{id}/     → detalhe de um evento (público)
    Escrita (POST/PUT/PATCH/DELETE) exige conta de staff — usar o Django Admin.
    """
    queryset         = EventoAgenda.objects.filter(ativo=True)
    serializer_class = EventoAgendaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'ativo']
    search_fields    = ['titulo', 'descricao', 'local']
    ordering_fields  = ['data_inicio', 'ordem']
    ordering         = ['data_inicio']
