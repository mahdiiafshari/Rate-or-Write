from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Competitor ,Competition


class CompetitionSerializer(serializers.ModelSerializer):
    competitor_count = serializers.IntegerField(read_only=True)  # matches annotation

    class Meta:
        model = Competition
        fields = ['id', 'name', 'status', 'competitor_count', 'is_public', 'bio', 'category']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']

class CompetitorSerializer(serializers.ModelSerializer):
    competition = CompetitionSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    competition_id = serializers.PrimaryKeyRelatedField(
        queryset=Competition.objects.all(),
        source='competition',
        write_only=True
    )

    class Meta:
        model = Competitor
        fields = ['id', 'competition', 'competition_id', 'user', 'post', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

