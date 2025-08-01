from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import GroupModel, GroupPostShare
from post.models import Post

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'post']


class GroupSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = GroupModel
        fields = ['id', 'name', 'created_by', 'users', 'created_at']


class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupModel
        fields = ['name']

    def validate(self, attrs):
        user = self.context['request'].user
        if GroupModel.objects.filter(created_by=user).count() >= 5:
            raise serializers.ValidationError("You can create up to 5 groups only.")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        group = GroupModel.objects.create(created_by=user, **validated_data)
        group.users.add(user)  # Add creator as a member
        return group


class MemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value


class SharePostSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()

    def validate_post_id(self, value):
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post not found")
        return value
