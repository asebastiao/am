from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Biografia
from .serializers import BiografiaSerializer


@api_view(['GET'])
def biografia_detail(request):
    """
    Endpoint para obter a biografia do artista.
    Corresponde ao que o frontend está chamando em /api/biografia/
    """
    biografia = Biografia.get_biografia()
    serializer = BiografiaSerializer(biografia, context={'request': request})
    return Response(serializer.data)


class BiografiaUpdateView(generics.RetrieveUpdateAPIView):
    """View para atualizar a biografia (admin)"""
    serializer_class = BiografiaSerializer

    def get_object(self):
        return Biografia.get_biografia()
