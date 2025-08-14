from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Follow
from .serializers import FollowSerializer, FollowStatsSerializer, UserSerializer

User = get_user_model()

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return super().get_queryset().filter(follower=self.request.user)

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)

    @action(detail=False, methods=['GET'])
    def followers(self, request):
        followers = Follow.objects.filter(following=request.user)
        serializer = self.get_serializer(followers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def following(self, request):
        following = Follow.objects.filter(follower=request.user)
        serializer = self.get_serializer(following, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path='stats')
    def stats(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"detail": "user_id query parameter is required."}, status=400)

        user = get_object_or_404(User, pk=user_id)
        data = {
            'id': user.id,
            'username': user.username,
            'follower_count': user.follower_relationships.count(),
            'following_count': user.following_relationships.count(),
            'is_following': Follow.objects.filter(follower=request.user, following=user).exists()
        }
        serializer = FollowStatsSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        """List users who follow this user."""
        user = self.get_object()
        followers = User.objects.filter(following_relationships__following=user)
        return Response(UserSerializer(followers, many=True).data)

    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        """List users this user is following."""
        user = self.get_object()
        following = User.objects.filter(follower_relationships__follower=user)
        return Response(UserSerializer(following, many=True).data)