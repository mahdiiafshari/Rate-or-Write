from django.db.models import Count, Exists, OuterRef
from rest_framework import generics, permissions, viewsets, status, views
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, Post, PostLike, PostCollection
from .permissions import IsAdminOrReadOnly, IsAuthorOrAdmin
from .serializers import CategorySerializer, PostSerializer, LikedPostSerializer, UserPostSerializer, \
    PostCollectionSerializer
from django_filters.rest_framework import DjangoFilterBackend





class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(status='published', is_deleted=False).select_related('author', 'category').annotate(
            like_count=Count('likes'),
            is_liked=Exists(PostLike.objects.filter(post=OuterRef('pk'), user=user))
        )


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('author', 'category').all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthorOrAdmin()]  # Author or admin can update/delete
        return [IsAuthenticated()]  # Anyone authenticated can read


class PostLikeViewSet(viewsets.ModelViewSet):
    queryset = PostLike.objects.select_related('post__author', 'post__category')
    serializer_class = LikedPostSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='toggle-like')
    def toggle_like(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk, status='published')
        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        existing = PostLike.objects.filter(user=user, post=post)

        if existing.exists():
            existing.delete()
            return Response({"detail": "Post unliked."}, status=status.HTTP_200_OK)
        else:
            PostLike.objects.create(user=user, post=post)
            return Response({"detail": "Post liked."}, status=status.HTTP_201_CREATED)


class MyPostsListView(generics.ListAPIView):
    """
    API view to retrieve posts created by the currently authenticated user.
    """
    serializer_class = UserPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user, is_deleted=False).order_by('-created_at')


class PostCollectionCreateView(views.APIView):
    """view to create a new post collection"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostCollectionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostCollectionListView(views.APIView):
    """View to list PostCollections for the authenticated user"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        collections = PostCollection.objects.filter(user=request.user)
        serializer = PostCollectionSerializer(collections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)