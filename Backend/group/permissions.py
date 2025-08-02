from rest_framework import permissions


class IsGroupOwner(permissions.BasePermission):
    """
    Custom permission to allow only the owner of the group to view it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.created_by == request.user


class NotGroupOwner(permissions.BasePermission):
    """
    Custom permission to allow only the non-owner of the group to view it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.created_by != request.user