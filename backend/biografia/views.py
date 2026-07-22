from rest_framework import generics, permissions
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
    """
    View para atualizar a biografia. GET é público; PUT/PATCH exige conta
    de staff autenticada (recomenda-se usar antes o Django Admin para isto).
    """
    serializer_class = BiografiaSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_object(self):
        return Biografia.get_biografia()
