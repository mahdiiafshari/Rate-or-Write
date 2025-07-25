from rest_framework import serializers
from .models import Category, Post, PostLike
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
