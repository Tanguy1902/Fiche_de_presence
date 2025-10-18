from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Lycee, Ninja, Session, Presence


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class LyceeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lycee
        fields = '__all__'


class NinjaSerializer(serializers.ModelSerializer):
    lycee = LyceeSerializer(read_only=True)

    class Meta:
        model = Ninja
        fields = '__all__'


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'


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
            'present',
            'fait_par', 'fait_par_detail',
            'created_at',
        ]

