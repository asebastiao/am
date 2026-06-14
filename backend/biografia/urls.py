from django.urls import path
from . import views

urlpatterns = [
    path('', views.biografia_detail, name='biografia-detail'),
    path('admin/', views.BiografiaUpdateView.as_view(), name='biografia-admin'),
]
