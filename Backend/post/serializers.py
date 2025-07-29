from rest_framework import serializers
from .models import Category, Post, PostLike, PostCollection
from users.models import CustomUser
from drf_spectacular.utils import extend_schema_field


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class PostSerializer(serializers.ModelSerializer):
    """Serializer for Post model, including like and category data."""
    author = serializers.StringRelatedField(read_only=True)  # Display author's string representation
    category = serializers.StringRelatedField(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    like_count = serializers.IntegerField(read_only=True)  # Use annotated field
    is_liked = serializers.BooleanField(read_only=True)  # Use annotated field

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'post', 'category', 'category_id', 'status', 'like_count', 'is_liked']
        read_only_fields = ['author', 'like_count', 'is_liked']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class LikedPostSerializer(serializers.ModelSerializer):
    """Serializer for liked posts, including post details."""

    class Meta:
        model = PostLike
        fields = ['id', 'post', 'created_at']


class UserPostSerializer(serializers.ModelSerializer):
    """serializer for specific user posts"""
    class Meta:
        model = Post
        fields = ['id', 'title', 'post', 'status', 'category', 'created_at', 'updated_at']


class PostCollectionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = PostCollection
        fields = ['id', 'title', 'user', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        collection = PostCollection.objects.create(**validated_data)
        return collection
