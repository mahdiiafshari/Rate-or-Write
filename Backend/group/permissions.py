from rest_framework import permissions
from .models import GroupModel, GroupMembership

class IsGroupOwner(permissions.BasePermission):
    """
    Custom permission to allow only users with the 'owner' role in the group.
    """
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, GroupModel):
            return False
        return GroupMembership.objects.filter(
            group=obj,
            user=request.user,
            role='owner'
        ).exists()

class IsGroupAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to allow only users with 'admin' or 'owner' role in the group.
    """
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, GroupModel):
            return False
        return GroupMembership.objects.filter(
            group=obj,
            user=request.user,
            role__in=['admin', 'owner']
        ).exists()

class NotGroupOwner(permissions.BasePermission):
    """
    Custom permission to allow only users who are not the group owner.
    """
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, GroupModel):
            return False
        return not GroupMembership.objects.filter(
            group=obj,
            user=request.user,
            role='owner'
        ).exists()