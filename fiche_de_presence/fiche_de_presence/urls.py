from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from presence.views import LyceeViewSet, NinjaViewSet, SessionViewSet, PresenceViewSet

router = DefaultRouter()
router.register(r'lycees', LyceeViewSet, basename='lycee')
router.register(r'ninjas', NinjaViewSet, basename='ninja')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'presences', PresenceViewSet, basename='presence')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # 🔐 JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
