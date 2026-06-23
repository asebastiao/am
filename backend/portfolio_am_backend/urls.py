from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/',         admin.site.urls),
    path('health/',        health),
    path('api/obras/',     include('obras.urls')),
    path('api/galeria/',   include('galeria.urls')),
    path('api/biografia/', include('biografia.urls')),
    path('api/contacto/',  include('contacto.urls')),
    path('api/agenda/',    include('agenda.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Servir /media/ localmente quando Cloudinary não está configurado
if settings.DEBUG and hasattr(settings, 'MEDIA_ROOT'):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
