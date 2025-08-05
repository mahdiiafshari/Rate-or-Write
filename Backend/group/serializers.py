from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import GroupModel, GroupPostShare, GroupMembership
from post.models import Post

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class GroupMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = GroupMembership
        fields = ['user', 'user_id', 'role']
        read_only_fields = ['user']

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value

class GroupSerializer(serializers.ModelSerializer):
    memberships = GroupMembershipSerializer(many=True, read_only=True, source='memberships')
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = GroupModel
        fields = ['id', 'name', 'created_by', 'memberships', 'created_at']

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
        # Add creator as owner via GroupMembership
        GroupMembership.objects.create(user=user, group=group, role='owner')
        return group

class SharePostSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()

    def validate_post_id(self, value):
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post not found")
        return value