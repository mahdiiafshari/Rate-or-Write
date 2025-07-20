from rest_framework import generics, permissions
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins .
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsAuthorOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admins and authors .
    """
    def has_object_permission(self, request, view, obj):
        # Allow read access to any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow write access (PUT, PATCH, DELETE) to the author or admin
        return obj.author == request.user or request.user.is_staff


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('author', 'category').all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthorOrAdmin()]  # Author or admin can update/delete
        return [IsAuthenticated()]  # Anyone authenticated can read