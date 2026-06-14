from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.ObraViewSet, basename='obra')

app_name = 'obras'

urlpatterns = [
    path('disponiveis/', views.obras_disponiveis, name='obras_disponiveis'),
    path('destaque/',    views.obras_destaque,    name='obras_destaque'),
    path('', include(router.urls)),
]
