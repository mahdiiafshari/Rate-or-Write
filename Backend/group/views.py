from django.shortcuts import get_object_or_404
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GroupModel, GroupPostShare, GroupMembership
from .permissions import IsGroupOwner, NotGroupOwner, IsGroupAdminOrOwner
from .serializers import (
    GroupSerializer, GroupCreateSerializer,
    SharePostSerializer, GroupMembershipSerializer
)
from post.serializers import PostSerializer
from post.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()


class GroupCreateView(generics.CreateAPIView):
    queryset = GroupModel.objects.all()
    serializer_class = GroupCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupDeleteView(generics.DestroyAPIView):
    """
    Deletes a single group by its ID only if the requesting user is the group's owner.
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
        # Return groups where the user is a member (via GroupMembership)
        return GroupModel.objects.filter(memberships__user=self.request.user)

class AddMemberToGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsGroupOwner]

    def post(self, request, group_id):
        serializer = GroupMembershipSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = get_object_or_404(GroupModel, id=group_id)
        self.check_object_permissions(request, group)
        user = get_object_or_404(User, id=serializer.validated_data['user_id'])

        # Check if user is already a member
        if GroupMembership.objects.filter(group=group, user=user).exists():
            return Response(
                {"detail": "User is already a member of this group."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add user to group with 'normal' role by default
        GroupMembership.objects.create(
            user=user,
            group=group,
            role=serializer.validated_data.get('role', 'normal')
        )
        return Response({"detail": "User added to group"}, status=status.HTTP_200_OK)

class ChangeMemberRoleView(APIView):
    """
    View to change the role of a specific user in a group.
    Only admins or owners can perform this action.
    """
    permission_classes = [permissions.IsAuthenticated, IsGroupAdminOrOwner]

    def patch(self, request, group_id, user_id):
        group = get_object_or_404(GroupModel, id=group_id)
        self.check_object_permissions(request, group)
        membership = get_object_or_404(GroupMembership, group=group, user__id=user_id)

        # Prevent changing the owner's role unless the requester is the owner
        if membership.role == 'owner' and not GroupMembership.objects.filter(
            group=group, user=request.user, role='owner'
        ).exists():
            return Response(
                {"detail": "Only the owner can change the owner's role."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = GroupMembershipSerializer(membership, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User role updated", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SharePostToGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        serializer = SharePostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group = get_object_or_404(GroupModel, id=group_id)
        membership = get_object_or_404(GroupMembership, group=group, user=request.user)

        # Restrict posting to non-banned members
        if membership.role == 'banned':
            return Response(
                {"detail": "You are banned from this group and cannot share posts."},
                status=status.HTTP_403_FORBIDDEN
            )

        post = get_object_or_404(Post, id=serializer.validated_data['post_id'])
        GroupPostShare.objects.create(group=group, post=post, shared_by=request.user)
        return Response({"detail": "Post shared to group"}, status=status.HTTP_200_OK)

class GroupPostsListView(generics.ListAPIView):
    """View to show list of posts in a specific group"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        group = get_object_or_404(GroupModel, id=self.kwargs['group_id'])
        membership = GroupMembership.objects.filter(group=group, user=self.request.user).first()
        if not membership or membership.role == 'banned':
            return Post.objects.none()  # Return empty queryset for non-members or banned users
        return group.posts.all()

class LeftGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, group_id):
        group = get_object_or_404(GroupModel, id=group_id)
        membership = GroupMembership.objects.filter(group=group, user=request.user).first()

        # Check if user is a member
        if not membership:
            return Response(
                {"detail": "You are not a member of this group"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent owner from leaving
        if membership.role == 'owner':
            return Response(
                {"detail": "You are the owner and cannot leave the group. Transfer ownership or delete the group."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Remove user from group
        membership.delete()

        return Response(
            {"detail": "You have left the group"},
            status=status.HTTP_200_OK
        )