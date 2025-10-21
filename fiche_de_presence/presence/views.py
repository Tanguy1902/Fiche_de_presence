from django.shortcuts import render
from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated
from .models import Lycee, Ninja, Session, Presence, Profil
from .serializers import LyceeSerializer, NinjaSerializer, SessionSerializer, PresenceSerializer, ProfilSerializer
from django.db import IntegrityError

# Viewset pour le lycée
class LyceeViewSet(viewsets.ModelViewSet):
    queryset = Lycee.objects.all() # recuperer tout les lycées existant dans la base des données
    print(queryset)
    serializer_class = LyceeSerializer

#viewset pour Profil
class ProfilViewset(viewsets.ModelViewSet):
    queryset = Profil.objects.all() # recuperer toutes les profils dans la base des données
    serializer_class = ProfilSerializer

# Viewset pour le Ninja
class NinjaViewSet(viewsets.ModelViewSet):
    serializer_class = NinjaSerializer
    queryset = Ninja.objects.all()
    permission_classes = [IsAuthenticated] # restriction: seuls les utilisateurs connecté peuvent voir les Ninja

    def get_queryset(self):
        user = self.request.user # recuperer l'utilisateur connecté
        
        if hasattr(user, "profil") and user.profil.equipe:
            lycee = user.profil.equipe.lycee
            ninjas = Ninja.objects.filter(lycee=lycee)
            return ninjas

        return Ninja.objects.none()

    
# Viewset pour Session
class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all() # Recuperer toutes les sessions dans la base des données
    serializer_class = SessionSerializer

class PresenceViewSet(viewsets.ModelViewSet):
    serializer_class = PresenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "profil") and user.profil.equipe:
            lycee = user.profil.equipe.lycee
            return Presence.objects.filter(lycee=lycee).select_related(
                'ninja', 'session', 'fait_par', 'lycee'
            ).order_by('-date', '-timestamp')
        return Presence.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        lycee = user.profil.equipe.lycee if hasattr(user, "profil") and user.profil.equipe else None
        ninja = serializer.validated_data.get("ninja")

        if lycee and ninja.lycee != lycee:
            raise serializers.ValidationError("Le ninja n'appartient pas à ce lycée.")

        try:
            serializer.save(fait_par=user, lycee=lycee or ninja.lycee)
        except IntegrityError:
            raise serializers.ValidationError(
                {"detail": "Ce ninja est déjà enregistré pour cette session."}
            )