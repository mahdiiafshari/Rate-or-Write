from rest_framework import generics, permissions, viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, Post, PostLike
from .serializers import CategorySerializer, PostSerializer, LikedPostSerializer
from django_filters.rest_framework import DjangoFilterBackend


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


class PostLikeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    serializer_class = LikedPostSerializer

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        liked_ids = PostLike.objects.filter(user=self.request.user).values_list('post_id', flat=True)
        return Post.objects.filter(id__in=liked_ids, is_published=True).order_by('-created_at')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'], url_path='toggle-like')
    def toggle_like(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk, is_published=True)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        like_qs = PostLike.objects.filter(user=request.user, post=post)
        if like_qs.exists():
            like_qs.delete()
            return Response({"detail": "Post unliked."}, status=status.HTTP_200_OK)
        else:
            PostLike.objects.create(user=request.user, post=post)
            return Response({"detail": "Post liked."}, status=status.HTTP_201_CREATED)