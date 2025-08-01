# views.py

from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GroupModel, GroupPostShare
from .permissions import IsGroupOwner
from .serializers import (
    GroupSerializer, GroupCreateSerializer, AddMemberSerializer,
    SharePostSerializer, PostSerializer
)
from post.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()


class GroupCreateView(generics.CreateAPIView):
    queryset = GroupModel.objects.all()
    serializer_class = GroupCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class GroupDeleteView(generics.DestroyAPIView):
    """
    Deletes a single group by its ID only if the requesting user is the group's creator.
    """
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer
    lookup_field = 'id'
    permission_classes = [permissions.IsAuthenticated, IsGroupOwner]

    def get_object(self):
        """
        Fetch the group instance and enforce object-level permission (ownership).
        """
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj

class GroupListView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.joined_groups.all()


class AddMemberToGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        serializer = AddMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = GroupModel.objects.get(id=group_id)

        if request.user != group.created_by:
            return Response({"detail": "Only group creator can add users."}, status=403)

        user = User.objects.get(id=serializer.validated_data['user_id'])
        group.users.add(user)
        return Response({"detail": "User added to group"})


class SharePostToGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        serializer = SharePostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group = GroupModel.objects.get(id=group_id)
        if request.user not in group.users.all():
            return Response({"detail": "You must be a group member to share posts."}, status=403)

        post = Post.objects.get(id=serializer.validated_data['post_id'])
        GroupPostShare.objects.create(group=group, post=post, shared_by=request.user)
        return Response({"detail": "Post shared to group"})


class GroupPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group = GroupModel.objects.get(id=self.kwargs['group_id'])
        if self.request.user not in group.users.all():
            return Post.objects.none()  # or raise PermissionDenied
        return group.posts.all()
