from rest_framework import serializers
from .models import Category, Post
from users.models import CustomUser


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