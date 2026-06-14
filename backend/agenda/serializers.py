from rest_framework import serializers
from .models import EventoAgenda


class EventoAgendaSerializer(serializers.ModelSerializer):
    upcoming    = serializers.ReadOnlyField()
    date_string = serializers.ReadOnlyField()

    class Meta:
        model  = EventoAgenda
        fields = [
            'id', 'titulo', 'date_string', 'data_inicio', 'data_fim',
            'local', 'descricao', 'tipo', 'upcoming', 'ordem',
        ]
