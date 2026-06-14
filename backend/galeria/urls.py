from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemGaleriaViewSet

# Criar router para as views
router = DefaultRouter()
router.register(r'', ItemGaleriaViewSet, basename='galeria')

app_name = 'galeria'

urlpatterns = [
    path('', include(router.urls)),
]
