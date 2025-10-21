from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Lycee, Ninja, Session, Presence, Equipe, Profil


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }


class LyceeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lycee
        fields = '__all__'
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }


class EquipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipe
        fields = '__all__'
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }


class ProfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profil
        fields = '__all__'
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }


class NinjaSerializer(serializers.ModelSerializer):
    lycee = LyceeSerializer(read_only=True)

    class Meta:
        model = Ninja
        fields = '__all__'
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }


class PresenceSerializer(serializers.ModelSerializer):
    ninja_detail = NinjaSerializer(source='ninja', read_only=True)
    session_detail = SessionSerializer(source='session', read_only=True)
    fait_par_detail = UserSerializer(source='fait_par', read_only=True)

    class Meta:
        model = Presence
        fields = [
            'id',
            'ninja', 'ninja_detail',
            'session', 'session_detail',
            'lycee',
            'present',
            'fait_par', 'fait_par_detail',
            'date',
            'timestamp',
        ]
        read_only_fields = ['lycee', 'timestamp', 'fait_par_detail']
        extra_kwargs = {
            'present': {'help_text': 'Cocher si le ninja est présent', 'default': False},
            'date': {'help_text': 'Date de la présence (YYYY-MM-DD)'}
        }

    def validate(self, data):
        ninja = data.get('ninja')
        session = data.get('session')
        lycee = data.get('lycee')

        # ✅ Vérification 1 : cohérence du lycée
        if ninja and lycee and ninja.lycee != lycee:
            raise serializers.ValidationError(
                {"detail": "Le ninja n'appartient pas à ce lycée."}
            )

        # ✅ Vérification 2 : éviter les doublons (ninja déjà enregistré dans la même session)
        if ninja and session:
            # Si l'objet est en création (pas encore sauvegardé)
            presence_existante = Presence.objects.filter(
                ninja=ninja, session=session
            ).exclude(pk=self.instance.pk if self.instance else None)

            if presence_existante.exists():
                raise serializers.ValidationError(
                    {"detail": "⚠️ Ce ninja est déjà enregistré pour cette session."}
                )

        return data

