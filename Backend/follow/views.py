from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Follow
from .serializers import FollowSerializer, FollowStatsSerializer

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

    @action(detail=True, methods=['GET'])
    def stats(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        data = {
            'user': user,
            'follower_count': user.follower_relationships.count(),
            'following_count': user.following_relationships.count(),
            'is_following': request.user.is_authenticated and
                          Follow.objects.filter(follower=request.user, following=user).exists()
        }
        serializer = FollowStatsSerializer(data)
        return Response(serializer.data)