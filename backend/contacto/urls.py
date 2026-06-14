from django.urls import path
from . import views

urlpatterns = [
    path('info/', views.info_contato, name='info-contato'),
    path('enviar/', views.enviar_mensagem, name='enviar-mensagem'),
]
