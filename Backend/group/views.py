from django.shortcuts import get_object_or_404
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GroupModel, GroupPostShare
from .permissions import IsGroupOwner, NotGroupOwner
from .serializers import (
    GroupSerializer, GroupCreateSerializer,
    SharePostSerializer, PostSerializer, MemberSerializer
)
from post.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()


class GroupCreateView(generics.CreateAPIView):
    queryset = GroupModel.objects.all()
    serializer_class = GroupCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


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
    permission_classes = [permissions.IsAuthenticated, IsGroupOwner]

    def post(self, request, group_id):
        serializer = MemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = get_object_or_404(GroupModel, id=group_id)
        self.check_object_permissions(request, group)
        user = get_object_or_404(User, id=serializer.validated_data['user_id'])
        # check if user is group subscriber
        if group.users.filter(id=user.id).exists():
            return Response(
                {"detail": "User is already a member of this group."},
                status=status.HTTP_400_BAD_REQUEST
            )

        group.users.add(user)
        return Response({"detail": "User added to group"}, status=status.HTTP_200_OK)



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
    """view to show list of post to specific group"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group = GroupModel.objects.get(id=self.kwargs['group_id'])
        if self.request.user not in group.users.all():
            return Post.objects.none()  # or raise PermissionDenied
        return group.posts.all()


class LeftGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        group = get_object_or_404(GroupModel, id=group_id)

        # Check if user is a member
        if not group.users.filter(id=request.user.id).exists():
            return Response(
                {"detail": "You are not a member of this group"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent creator from leaving
        if group.created_by == request.user:
            return Response(
                {"detail": "You are the creator and cannot leave the group. Transfer ownership or delete the group."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Remove user from group
        group.users.remove(request.user)

        return Response(
            {"detail": "You have left the group"},
            status=status.HTTP_200_OK
        )