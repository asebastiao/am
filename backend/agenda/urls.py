from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventoAgendaViewSet

router = DefaultRouter()
router.register(r'', EventoAgendaViewSet, basename='agenda')

app_name = 'agenda'

urlpatterns = [
    path('', include(router.urls)),
]
