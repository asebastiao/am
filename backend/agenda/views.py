from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import EventoAgenda
from .serializers import EventoAgendaSerializer


class EventoAgendaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerir eventos da agenda.
    GET /api/agenda/          → lista todos os eventos activos
    GET /api/agenda/{id}/     → detalhe de um evento
    """
    queryset         = EventoAgenda.objects.filter(ativo=True)
    serializer_class = EventoAgendaSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tipo', 'ativo']
    search_fields    = ['titulo', 'descricao', 'local']
    ordering_fields  = ['data_inicio', 'ordem']
    ordering         = ['data_inicio']
