from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from presence.views import LyceeViewSet, NinjaViewSet, SessionViewSet, PresenceViewSet, ProfilViewset
from rest_framework.decorators import api_view
from rest_framework.response import Response

# --- Swagger ---
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="API Fiche de Présence",
        default_version='v1',
        description="API pour gérer les lycées, ninjas, sessions et présences",
        contact=openapi.Contact(email="tanguymarcel1902@gmail.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# --- Router DRF ---
router = DefaultRouter()
router.register(r'lycees', LyceeViewSet, basename='lycee')
router.register(r'ninjas', NinjaViewSet, basename='ninja')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'presences', PresenceViewSet, basename='presence')
router.register(r'profils', ProfilViewset, basename='profils')


@api_view(['GET'])
def api_root(request):
    return Response({
        "lycees": request.build_absolute_uri("/api/lycees/"),
        "ninjas": request.build_absolute_uri("/api/ninjas/"),
        "sessions": request.build_absolute_uri("/api/sessions/"),
        "presences": request.build_absolute_uri("/api/presences/"),
        "profils": request.build_absolute_uri("/api/profils/"),
        "token": request.build_absolute_uri("/api/token/"),
    })


urlpatterns = [
    path('admin/', admin.site.urls),

    # Page d’accueil API
    path('api/', api_root, name='api_root'),
    path('api/', include(router.urls)),

    # 🔐 JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- Swagger / ReDoc ---
    path('swagger(<format>\.json|\.yaml)', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
