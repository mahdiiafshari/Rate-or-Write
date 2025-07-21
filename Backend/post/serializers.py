from rest_framework import serializers
from .models import Category, Post
from users.models import CustomUser
from drf_spectacular.utils import extend_schema_field


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)  # Display author's string representation
    category = CategorySerializer(read_only=True)  # Nested category data
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )  # For writing category ID

    class Meta:
        model = Post
        fields = ['id', 'author', 'post', 'category', 'category_id']
        read_only_fields = ['author']  # Author is set automatically


class LikedPostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post  # ✅ Correct model
        fields = ['id', 'like_count', 'is_liked']  # Add relevant fields from StudyPost

    @extend_schema_field(serializers.IntegerField())
    def get_like_count(self, obj):
        return obj.likes.count()  # 'likes' is the related_name on StudyPostLike

    @extend_schema_field(serializers.BooleanField())
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False