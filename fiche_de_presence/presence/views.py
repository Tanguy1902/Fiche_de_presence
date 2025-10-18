from django.shortcuts import render
from rest_framework import viewsets
from .models import Lycee, Ninja, Session, Presence
from .serializers import LyceeSerializer, NinjaSerializer, SessionSerializer, PresenceSerializer
from rest_framework.permissions import IsAuthenticated

class LyceeViewSet(viewsets.ModelViewSet):
    queryset = Lycee.objects.all()
    serializer_class = LyceeSerializer

class NinjaViewSet(viewsets.ModelViewSet):
    queryset = Ninja.objects.all()
    serializer_class = NinjaSerializer

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer



class PresenceViewSet(viewsets.ModelViewSet):
    serializer_class = PresenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Presence.objects.all().select_related('ninja', 'session', 'fait_par')
        session_id = self.request.query_params.get('session')
        if session_id:
            queryset = queryset.filter(session_id=session_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(fait_par=self.request.user)

