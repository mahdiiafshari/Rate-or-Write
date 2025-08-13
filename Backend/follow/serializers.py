from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = fields

class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)
    follower_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='follower',
        write_only=True
    )
    following_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='following',
        write_only=True
    )

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following', 'follower_id', 'following_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, data):
        if data['follower'] == data['following']:
            raise serializers.ValidationError("You cannot follow yourself.")
        return data

class FollowStatsSerializer(serializers.Serializer):
    user = UserSerializer()
    follower_count = serializers.IntegerField()
    following_count = serializers.IntegerField()
    is_following = serializers.BooleanField()